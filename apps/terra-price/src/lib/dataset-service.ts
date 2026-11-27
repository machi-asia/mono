import { createClient } from "@mono/auth";
import commodityLocationsJson from "../data/commodity-locations.json";
import {
  CATEGORIES,
  COMMODITIES_BY_CATEGORY,
  PHILIPPINES_BOUNDS,
  SEED_DATASETS,
  type DatasetEntry,
} from "../data/catalog";

interface RawCommodityLocation {
  m: string;
  la: number;
  lo: number;
  pt: "R" | "W" | "F";
  p: number;
  n: number;
}

export interface CommodityMapPoint {
  market: string;
  latitude: number;
  longitude: number;
  pricetype: "Retail" | "Wholesale" | "Farm Gate";
  price: number;
  samples: number;
}

export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
  has_next: boolean;
  has_prev: boolean;
  limit: number;
}

export interface PaginatedDatasetsResult {
  datasets: DatasetEntry[];
  pagination: PaginationMeta;
  source: "supabase" | "fallback";
}

export interface NewDatasetInput {
  latitude: number;
  longitude: number;
  category: string;
  commodity: string;
  pricetype: string;
  price: number;
}

export interface AddDatasetResult {
  success: boolean;
  entry?: DatasetEntry;
  message: string;
  source: "supabase" | "fallback";
}

export function getCategories(): string[] {
  return [...CATEGORIES];
}

export function getCommoditiesByCategory(category: string): string[] {
  return COMMODITIES_BY_CATEGORY[category] ? [...COMMODITIES_BY_CATEGORY[category]] : [];
}

function decodePriceType(pt: RawCommodityLocation["pt"]): CommodityMapPoint["pricetype"] {
  if (pt === "W") return "Wholesale";
  if (pt === "F") return "Farm Gate";
  return "Retail";
}

function normalizePriceTypeLabel(pt?: string): CommodityMapPoint["pricetype"] | null {
  if (!pt) return null;
  const lower = pt.trim().toLowerCase();
  if (lower === "wholesale") return "Wholesale";
  if (lower === "farm gate") return "Farm Gate";
  if (lower === "retail") return "Retail";
  return null;
}

/**
 * Returns all historical dataset locations for a given commodity (filtered by pricetype
 * when matching points exist, or all price types if none match), merged with live/session entries.
 */
export function getCommodityMapPoints(
  commodity: string,
  pricetype?: string,
  extraEntries: DatasetEntry[] = []
): CommodityMapPoint[] {
  if (!commodity) return [];

  const catalog = commodityLocationsJson as Record<string, RawCommodityLocation[]>;
  const rawList = catalog[commodity] ?? [];
  const requestedPt = normalizePriceTypeLabel(pricetype);

  const decoded: CommodityMapPoint[] = rawList.map((item) => ({
    market: item.m,
    latitude: item.la,
    longitude: item.lo,
    pricetype: decodePriceType(item.pt),
    price: item.p,
    samples: item.n,
  }));

  const mergedExtras: CommodityMapPoint[] = extraEntries
    .filter((e) => e.commodity === commodity)
    .map((e) => ({
      market: "Community Entry",
      latitude: Number(e.latitude),
      longitude: Number(e.longitude),
      pricetype: normalizePriceTypeLabel(e.pricetype) ?? "Retail",
      price: Number(e.price),
      samples: 1,
    }));

  const combined = [...decoded, ...mergedExtras];
  if (!requestedPt) return combined;

  const matching = combined.filter((pt) => pt.pricetype === requestedPt);
  return matching.length > 0 ? matching : combined;
}

export function isWithinPhilippinesBounds(lat: number, lng: number): boolean {
  const [[minLat, minLng], [maxLat, maxLng]] = PHILIPPINES_BOUNDS;
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= minLat &&
    lat <= maxLat &&
    lng >= minLng &&
    lng <= maxLng
  );
}

function normalizeDatasetRow(row: Record<string, unknown>): DatasetEntry {
  return {
    id: Number(row.id ?? 0),
    latitude: Number(row.latitude ?? 0),
    longitude: Number(row.longitude ?? 0),
    category: String(row.category ?? ""),
    commodity: String(row.commodity ?? ""),
    pricetype: String(row.pricetype ?? "Retail"),
    price: Number(row.price ?? 0),
    user_id: typeof row.user_id === "string" ? row.user_id : null,
    created_at: typeof row.created_at === "string" ? row.created_at : undefined,
  };
}

export async function fetchDatasetsPaginated(
  page = 1,
  limit = 50,
  localExtras: DatasetEntry[] = []
): Promise<PaginatedDatasetsResult> {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const offset = (safePage - 1) * safeLimit;

  try {
    const supabase = createClient();
    const { data, count, error } = await supabase
      .from("terraprice_datasets")
      .select("id, latitude, longitude, category, commodity, pricetype, price, created_at", {
        count: "exact",
      })
      .order("id", { ascending: false })
      .range(offset, offset + safeLimit - 1);

    if (!error && Array.isArray(data) && data.length > 0) {
      const totalCount = typeof count === "number" ? count : data.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / safeLimit));
      return {
        datasets: data.map((row) => normalizeDatasetRow(row as Record<string, unknown>)),
        pagination: {
          current_page: safePage,
          total_pages: totalPages,
          total_count: totalCount,
          has_next: safePage < totalPages,
          has_prev: safePage > 1,
          limit: safeLimit,
        },
        source: "supabase",
      };
    }
  } catch {
    // Graceful fallback to local bundled dataset seed
  }

  const combined = [...localExtras, ...SEED_DATASETS].sort((a, b) => b.id - a.id);
  const totalCount = combined.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / safeLimit));
  const datasets = combined.slice(offset, offset + safeLimit);

  return {
    datasets,
    pagination: {
      current_page: safePage,
      total_pages: totalPages,
      total_count: totalCount,
      has_next: safePage < totalPages,
      has_prev: safePage > 1,
      limit: safeLimit,
    },
    source: "fallback",
  };
}

export async function fetchLatestDatasets(
  limit = 5,
  localExtras: DatasetEntry[] = []
): Promise<{ datasets: DatasetEntry[]; source: "supabase" | "fallback" }> {
  const safeLimit = Math.max(1, limit);

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("terraprice_datasets")
      .select("id, latitude, longitude, category, commodity, pricetype, price, created_at")
      .order("id", { ascending: false })
      .limit(safeLimit);

    if (!error && Array.isArray(data) && data.length > 0) {
      return {
        datasets: data.map((row) => normalizeDatasetRow(row as Record<string, unknown>)),
        source: "supabase",
      };
    }
  } catch {
    // Graceful fallback to local bundled dataset seed
  }

  const combined = [...localExtras, ...SEED_DATASETS].sort((a, b) => b.id - a.id);
  return {
    datasets: combined.slice(0, safeLimit),
    source: "fallback",
  };
}

export async function addDatasetEntry(
  input: NewDatasetInput,
  userId?: string | null
): Promise<AddDatasetResult> {
  if (!isWithinPhilippinesBounds(input.latitude, input.longitude)) {
    return {
      success: false,
      message: "Coordinates must fall within the Philippines bounds.",
      source: "fallback",
    };
  }

  if (!Number.isFinite(input.price) || input.price < 0) {
    return {
      success: false,
      message: "Price must be a valid non-negative number.",
      source: "fallback",
    };
  }

  const normalizedPricetype =
    input.pricetype.toLowerCase() === "wholesale" ? "Wholesale" : "Retail";

  const payload = {
    latitude: Number(input.latitude.toFixed(6)),
    longitude: Number(input.longitude.toFixed(6)),
    category: input.category,
    commodity: input.commodity,
    pricetype: normalizedPricetype,
    price: Number(input.price.toFixed(2)),
    ...(userId ? { user_id: userId } : {}),
  };

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("terraprice_datasets")
      .insert(payload as never)
      .select("id, latitude, longitude, category, commodity, pricetype, price, created_at")
      .single();

    if (!error && data) {
      return {
        success: true,
        entry: normalizeDatasetRow(data as Record<string, unknown>),
        message: "Dataset entry added successfully to Supabase.",
        source: "supabase",
      };
    }
  } catch {
    // Fall back to session dataset insertion
  }

  const localEntry: DatasetEntry = {
    id: Date.now(),
    latitude: payload.latitude,
    longitude: payload.longitude,
    category: payload.category,
    commodity: payload.commodity,
    pricetype: payload.pricetype,
    price: payload.price,
    user_id: userId ?? null,
    created_at: new Date().toISOString(),
  };

  return {
    success: true,
    entry: localEntry,
    message: "Dataset entry recorded in active workspace session.",
    source: "fallback",
  };
}
