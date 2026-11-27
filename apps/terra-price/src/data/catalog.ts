export interface MarketPreset {
  id: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
}

export interface DatasetEntry {
  id: number;
  latitude: number;
  longitude: number;
  category: string;
  commodity: string;
  pricetype: "Retail" | "Wholesale" | string;
  price: number;
  user_id?: string | null;
  created_at?: string;
}

export const PHILIPPINES_BOUNDS: [[number, number], [number, number]] = [
  [4.2158, 116.87],
  [21.321, 126.605],
];

export const PHILIPPINES_CENTER: [number, number] = [12.8797, 121.774];

export const HISTORICAL_DATASET_TOTAL = 132902;

export const CATEGORIES: string[] = [
  "cereals and tubers",
  "meat, fish and eggs",
  "miscellaneous food",
  "oil and fats",
  "pulses and nuts",
  "vegetables and fruits"
];

export const COMMODITIES_BY_CATEGORY: Record<string, string[]> = {
  "cereals and tubers": [
    "Maize (white)",
    "Maize (yellow)",
    "Maize flour (white)",
    "Maize flour (yellow)",
    "Potatoes (Irish)",
    "Rice (milled, superior)",
    "Rice (paddy)",
    "Rice (premium)",
    "Rice (regular, milled)",
    "Rice (special)",
    "Rice (well milled)",
    "Semolina (white)",
    "Semolina (yellow)",
    "Sweet potatoes",
    "Taro"
  ],
  "meat, fish and eggs": [
    "Anchovies",
    "Chicken",
    "Crab",
    "Eggs",
    "Eggs (duck)",
    "Fish (fresh)",
    "Fish (frigate tuna)",
    "Fish (mackerel, fresh)",
    "Fish (milkfish)",
    "Fish (redbelly yellowtail fusilier)",
    "Fish (roundscad)",
    "Fish (slipmouth)",
    "Fish (threadfin bream)",
    "Fish (tilapia)",
    "Meat (beef)",
    "Meat (beef, chops with bones)",
    "Meat (chicken, whole)",
    "Meat (pork)",
    "Meat (pork, hock)",
    "Meat (pork, with bones)",
    "Meat (pork, with fat)",
    "Shrimp (endeavor)",
    "Shrimp (tiger)"
  ],
  "miscellaneous food": [
    "Sugar (brown)",
    "Sugar (white)"
  ],
  "oil and fats": [
    "Oil (cooking)"
  ],
  "pulses and nuts": [
    "Beans (mung)",
    "Groundnuts (shelled)",
    "Groundnuts (unshelled)"
  ],
  "vegetables and fruits": [
    "Bananas (lakatan)",
    "Bananas (latundan)",
    "Bananas (saba)",
    "Beans (green, fresh)",
    "Beans (string)",
    "Bitter melon",
    "Bottle gourd",
    "Cabbage",
    "Cabbage (chinese)",
    "Calamansi",
    "Carrots",
    "Choko",
    "Coconut",
    "Eggplants",
    "Garlic",
    "Garlic (large)",
    "Garlic (small)",
    "Ginger",
    "Mandarins",
    "Mangoes (carabao)",
    "Mangoes (piko)",
    "Onions (red)",
    "Onions (white)",
    "Papaya",
    "Pineapples",
    "Squashes",
    "Sweet Potato leaves",
    "Tomatoes",
    "Water spinach"
  ]
};

export const PHILIPPINES_MARKET_PRESETS: MarketPreset[] = [
  {
    "id": "metro-manila",
    "name": "Metro Manila",
    "region": "National Capital region",
    "latitude": 14.6,
    "longitude": 120.98
  },
  {
    "id": "palayan",
    "name": "Palayan",
    "region": "Region III",
    "latitude": 15.54,
    "longitude": 121.08
  },
  {
    "id": "cebu-city",
    "name": "Cebu City",
    "region": "Region VII",
    "latitude": 10.31,
    "longitude": 123.89
  },
  {
    "id": "iloilo-city",
    "name": "Iloilo City",
    "region": "Region VI",
    "latitude": 10.7,
    "longitude": 122.56
  },
  {
    "id": "davao-city",
    "name": "Davao City",
    "region": "Region XI",
    "latitude": 7.18,
    "longitude": 125.44
  },
  {
    "id": "zamboanga-city",
    "name": "Zamboanga City",
    "region": "Region IX",
    "latitude": 6.91,
    "longitude": 122.07
  },
  {
    "id": "baguio-city",
    "name": "Baguio City",
    "region": "Cordillera Administrative region",
    "latitude": 16.42,
    "longitude": 120.6
  },
  {
    "id": "cagayan-de-oro-city",
    "name": "Cagayan de Oro City",
    "region": "Region X",
    "latitude": 8.48,
    "longitude": 124.65
  }
];

export const SEED_DATASETS: DatasetEntry[] = [
  {
    "id": 60,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "vegetables and fruits",
    "commodity": "Tomatoes",
    "pricetype": "Retail",
    "price": 81.67
  },
  {
    "id": 59,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "vegetables and fruits",
    "commodity": "Papaya",
    "pricetype": "Retail",
    "price": 45.0
  },
  {
    "id": 58,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "vegetables and fruits",
    "commodity": "Onions (red)",
    "pricetype": "Retail",
    "price": 114.17
  },
  {
    "id": 57,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "vegetables and fruits",
    "commodity": "Mangoes (carabao)",
    "pricetype": "Retail",
    "price": 106.67
  },
  {
    "id": 56,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "vegetables and fruits",
    "commodity": "Garlic (large)",
    "pricetype": "Retail",
    "price": 108.0
  },
  {
    "id": 55,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "vegetables and fruits",
    "commodity": "Eggplants",
    "pricetype": "Retail",
    "price": 103.33
  },
  {
    "id": 54,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "vegetables and fruits",
    "commodity": "Carrots",
    "pricetype": "Retail",
    "price": 97.67
  },
  {
    "id": 53,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "vegetables and fruits",
    "commodity": "Calamansi",
    "pricetype": "Retail",
    "price": 71.67
  },
  {
    "id": 52,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "vegetables and fruits",
    "commodity": "Cabbage (chinese)",
    "pricetype": "Retail",
    "price": 105.33
  },
  {
    "id": 51,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "vegetables and fruits",
    "commodity": "Cabbage",
    "pricetype": "Retail",
    "price": 84.67
  },
  {
    "id": 50,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "vegetables and fruits",
    "commodity": "Bitter melon",
    "pricetype": "Retail",
    "price": 127.0
  },
  {
    "id": 49,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "vegetables and fruits",
    "commodity": "Beans (string)",
    "pricetype": "Retail",
    "price": 112.33
  },
  {
    "id": 48,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "vegetables and fruits",
    "commodity": "Beans (green, fresh)",
    "pricetype": "Retail",
    "price": 79.33
  },
  {
    "id": 47,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "vegetables and fruits",
    "commodity": "Bananas (latundan)",
    "pricetype": "Retail",
    "price": 42.0
  },
  {
    "id": 46,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "vegetables and fruits",
    "commodity": "Bananas (lakatan)",
    "pricetype": "Retail",
    "price": 72.0
  },
  {
    "id": 45,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "oil and fats",
    "commodity": "Oil (cooking)",
    "pricetype": "Retail",
    "price": 71.0
  },
  {
    "id": 44,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "miscellaneous food",
    "commodity": "Sugar (brown)",
    "pricetype": "Retail",
    "price": 41.7
  },
  {
    "id": 43,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "meat, fish and eggs",
    "commodity": "Meat (pork, with fat)",
    "pricetype": "Retail",
    "price": 336.0
  },
  {
    "id": 42,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "meat, fish and eggs",
    "commodity": "Meat (pork)",
    "pricetype": "Retail",
    "price": 320.67
  },
  {
    "id": 41,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "meat, fish and eggs",
    "commodity": "Meat (beef, chops with bones)",
    "pricetype": "Retail",
    "price": 242.0
  },
  {
    "id": 40,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "meat, fish and eggs",
    "commodity": "Meat (beef)",
    "pricetype": "Retail",
    "price": 320.67
  },
  {
    "id": 39,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "meat, fish and eggs",
    "commodity": "Fish (roundscad)",
    "pricetype": "Retail",
    "price": 169.0
  },
  {
    "id": 38,
    "latitude": 8.96,
    "longitude": 125.53,
    "category": "cereals and tubers",
    "commodity": "Potatoes (Irish)",
    "pricetype": "Retail",
    "price": 108.0
  },
  {
    "id": 37,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "vegetables and fruits",
    "commodity": "Papaya",
    "pricetype": "Retail",
    "price": 33.33
  },
  {
    "id": 36,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "vegetables and fruits",
    "commodity": "Mangoes (carabao)",
    "pricetype": "Retail",
    "price": 100.0
  },
  {
    "id": 35,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "vegetables and fruits",
    "commodity": "Ginger",
    "pricetype": "Retail",
    "price": 100.0
  },
  {
    "id": 34,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "vegetables and fruits",
    "commodity": "Garlic (small)",
    "pricetype": "Retail",
    "price": 180.0
  },
  {
    "id": 33,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "vegetables and fruits",
    "commodity": "Eggplants",
    "pricetype": "Retail",
    "price": 74.33
  },
  {
    "id": 32,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "vegetables and fruits",
    "commodity": "Carrots",
    "pricetype": "Retail",
    "price": 90.33
  },
  {
    "id": 31,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "vegetables and fruits",
    "commodity": "Cabbage (chinese)",
    "pricetype": "Retail",
    "price": 72.0
  },
  {
    "id": 30,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "vegetables and fruits",
    "commodity": "Beans (string)",
    "pricetype": "Retail",
    "price": 60.0
  },
  {
    "id": 29,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "vegetables and fruits",
    "commodity": "Beans (green, fresh)",
    "pricetype": "Retail",
    "price": 78.67
  },
  {
    "id": 28,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "vegetables and fruits",
    "commodity": "Bananas (latundan)",
    "pricetype": "Retail",
    "price": 34.0
  },
  {
    "id": 27,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "vegetables and fruits",
    "commodity": "Bananas (lakatan)",
    "pricetype": "Retail",
    "price": 38.33
  },
  {
    "id": 26,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "oil and fats",
    "commodity": "Oil (cooking)",
    "pricetype": "Retail",
    "price": 45.59
  },
  {
    "id": 25,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "miscellaneous food",
    "commodity": "Sugar (white)",
    "pricetype": "Retail",
    "price": 50.17
  },
  {
    "id": 24,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "meat, fish and eggs",
    "commodity": "Meat (pork)",
    "pricetype": "Retail",
    "price": 200.0
  },
  {
    "id": 23,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "meat, fish and eggs",
    "commodity": "Meat (chicken, whole)",
    "pricetype": "Retail",
    "price": 213.5
  },
  {
    "id": 22,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "meat, fish and eggs",
    "commodity": "Meat (beef, chops with bones)",
    "pricetype": "Retail",
    "price": 188.33
  },
  {
    "id": 21,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "meat, fish and eggs",
    "commodity": "Fish (tilapia)",
    "pricetype": "Retail",
    "price": 143.33
  },
  {
    "id": 20,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "meat, fish and eggs",
    "commodity": "Fish (roundscad)",
    "pricetype": "Retail",
    "price": 165.33
  },
  {
    "id": 19,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "cereals and tubers",
    "commodity": "Rice (well milled)",
    "pricetype": "Retail",
    "price": 36.75
  },
  {
    "id": 18,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "cereals and tubers",
    "commodity": "Rice (special)",
    "pricetype": "Retail",
    "price": 42.56
  },
  {
    "id": 17,
    "latitude": 7.01,
    "longitude": 125.09,
    "category": "cereals and tubers",
    "commodity": "Potatoes (Irish)",
    "pricetype": "Retail",
    "price": 80.0
  },
  {
    "id": 16,
    "latitude": 7.18,
    "longitude": 125.44,
    "category": "vegetables and fruits",
    "commodity": "Tomatoes",
    "pricetype": "Retail",
    "price": 44.25
  },
  {
    "id": 15,
    "latitude": 7.18,
    "longitude": 125.44,
    "category": "vegetables and fruits",
    "commodity": "Onions (red)",
    "pricetype": "Retail",
    "price": 106.0
  },
  {
    "id": 14,
    "latitude": 7.18,
    "longitude": 125.44,
    "category": "vegetables and fruits",
    "commodity": "Mangoes (carabao)",
    "pricetype": "Retail",
    "price": 144.0
  },
  {
    "id": 13,
    "latitude": 7.18,
    "longitude": 125.44,
    "category": "vegetables and fruits",
    "commodity": "Garlic (small)",
    "pricetype": "Retail",
    "price": 95.0
  },
  {
    "id": 12,
    "latitude": 7.18,
    "longitude": 125.44,
    "category": "vegetables and fruits",
    "commodity": "Garlic (large)",
    "pricetype": "Retail",
    "price": 86.0
  },
  {
    "id": 11,
    "latitude": 7.18,
    "longitude": 125.44,
    "category": "vegetables and fruits",
    "commodity": "Eggplants",
    "pricetype": "Retail",
    "price": 69.75
  },
  {
    "id": 10,
    "latitude": 7.18,
    "longitude": 125.44,
    "category": "vegetables and fruits",
    "commodity": "Carrots",
    "pricetype": "Retail",
    "price": 79.0
  },
  {
    "id": 9,
    "latitude": 7.18,
    "longitude": 125.44,
    "category": "vegetables and fruits",
    "commodity": "Calamansi",
    "pricetype": "Retail",
    "price": 45.25
  },
  {
    "id": 8,
    "latitude": 7.18,
    "longitude": 125.44,
    "category": "vegetables and fruits",
    "commodity": "Cabbage (chinese)",
    "pricetype": "Retail",
    "price": 96.0
  },
  {
    "id": 7,
    "latitude": 7.18,
    "longitude": 125.44,
    "category": "vegetables and fruits",
    "commodity": "Cabbage",
    "pricetype": "Retail",
    "price": 67.5
  },
  {
    "id": 6,
    "latitude": 7.18,
    "longitude": 125.44,
    "category": "vegetables and fruits",
    "commodity": "Bitter melon",
    "pricetype": "Retail",
    "price": 93.05
  },
  {
    "id": 5,
    "latitude": 7.18,
    "longitude": 125.44,
    "category": "vegetables and fruits",
    "commodity": "Beans (string)",
    "pricetype": "Retail",
    "price": 57.75
  },
  {
    "id": 4,
    "latitude": 7.18,
    "longitude": 125.44,
    "category": "vegetables and fruits",
    "commodity": "Beans (green, fresh)",
    "pricetype": "Retail",
    "price": 91.0
  },
  {
    "id": 3,
    "latitude": 7.18,
    "longitude": 125.44,
    "category": "vegetables and fruits",
    "commodity": "Bananas (latundan)",
    "pricetype": "Retail",
    "price": 34.75
  },
  {
    "id": 2,
    "latitude": 7.18,
    "longitude": 125.44,
    "category": "oil and fats",
    "commodity": "Oil (cooking)",
    "pricetype": "Retail",
    "price": 50.85
  },
  {
    "id": 1,
    "latitude": 7.18,
    "longitude": 125.44,
    "category": "miscellaneous food",
    "commodity": "Sugar (brown)",
    "pricetype": "Retail",
    "price": 41.27
  }
];
