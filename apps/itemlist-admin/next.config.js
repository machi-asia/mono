const isStaticExport =
  process.env.NODE_ENV === "production" ||
  process.env.STATIC_EXPORT === "true" ||
  process.env.CAPACITOR_BUILD === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isStaticExport
    ? {
        output: "export",
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
