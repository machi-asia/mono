export type UserRoleTier = "guest" | "member" | "pro" | "admin" | "authenticated";

export interface ImageCompressionOptions {
  maxSizeKB?: number;
  maxWidthOrHeight?: number;
  initialQuality?: number;
}

/**
 * Determines compression max size constraint by user tier:
 * - "guest": 2 KB (2 * 1024 bytes)
 * - "member" / "authenticated": 20 KB (20 * 1024 bytes)
 * - "pro": 10 MB (10 * 1024 * 1024 bytes = 10240 KB)
 * - "admin": no compression (Infinity / skip)
 */
export function getCompressionTierSizeKB(tier: UserRoleTier): number {
  switch (tier) {
    case "guest":
      return 2;
    case "pro":
      return 10 * 1024; // 10 MB
    case "admin":
      return Infinity;
    case "member":
    case "authenticated":
    default:
      return 20; // 20 KB
  }
}

/**
 * Compresses an image file in the browser using HTML5 Canvas
 * if its size exceeds the maximum allowed size for the given user tier.
 */
export async function compressImageFile(
  file: File,
  tier: UserRoleTier = "member"
): Promise<File> {
  const maxKB = getCompressionTierSizeKB(tier);
  
  // Admin bypass: no compression
  if (!Number.isFinite(maxKB)) {
    return file;
  }

  // If not an image or SVG/GIF (preserve vector and animations), return original
  const mime = file.type.toLowerCase();
  if (!mime.startsWith("image/") || mime.includes("svg") || mime.includes("gif")) {
    return file;
  }

  const maxBytes = maxKB * 1024;

  // If file is already smaller than limit, return as-is
  if (file.size <= maxBytes) {
    return file;
  }

  // Load image into HTML Image object
  return new Promise<File>((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Scale down dimensions for very small limits (e.g. 2KB, 20KB)
        const targetDimension = maxKB <= 2 ? 128 : maxKB <= 20 ? 320 : 2560;
        if (width > targetDimension || height > targetDimension) {
          if (width > height) {
            height = Math.round((height * targetDimension) / width);
            width = targetDimension;
          } else {
            width = Math.round((width * targetDimension) / height);
            height = targetDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Determine target mime type
        const outputMime = mime === "image/png" && maxKB > 20 ? "image/png" : "image/jpeg";

        // Iterative quality adjustment
        let minQuality = 0.1;
        let maxQuality = 0.85;
        let bestBlob: Blob | null = null;

        for (let iteration = 0; iteration < 4; iteration++) {
          const currentQuality = (minQuality + maxQuality) / 2;
          const blob = await new Promise<Blob | null>((res) =>
            canvas.toBlob(res, outputMime, currentQuality)
          );

          if (!blob) break;

          bestBlob = blob;
          if (blob.size <= maxBytes) {
            minQuality = currentQuality;
          } else {
            maxQuality = currentQuality;
          }
        }

        if (!bestBlob || bestBlob.size > maxBytes) {
          // Additional downscaling pass if still larger than target limit
          const scaleFactor = maxKB <= 2 ? 0.5 : 0.7;
          canvas.width = Math.max(Math.round(canvas.width * scaleFactor), 32);
          canvas.height = Math.max(Math.round(canvas.height * scaleFactor), 32);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          bestBlob = await new Promise<Blob | null>((res) =>
            canvas.toBlob(res, "image/jpeg", 0.4)
          );
        }

        if (bestBlob) {
          const compressedFile = new File([bestBlob], file.name, {
            type: bestBlob.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      } catch {
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}
