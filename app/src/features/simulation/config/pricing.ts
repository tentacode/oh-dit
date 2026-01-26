export interface PageRange {
  label: string;
  min: number;
  max: number | null;
  basePrice: number;
}

export interface ComplexityLevel {
  label: string;
  value: number;
  factor: number;
}

export const PAGE_RANGES: PageRange[] = [
  {
    label: "1 à 5 pages",
    min: 1,
    max: 5,
    basePrice: 800,
  },
  {
    label: "6 à 10 pages",
    min: 6,
    max: 10,
    basePrice: 1600,
  },
  {
    label: "11 à 15 pages",
    min: 11,
    max: 15,
    basePrice: 2400,
  },
  {
    label: "16 à 20 pages",
    min: 16,
    max: 20,
    basePrice: 3200,
  },
  {
    label: "20 pages et plus",
    min: 21,
    max: null,
    basePrice: 4000,
  },
];

export const COMPLEXITY_LEVELS: ComplexityLevel[] = [
  {
    label: "Très simple",
    value: 0,
    factor: 0.9,
  },
  {
    label: "Standard",
    value: 1,
    factor: 1.0,
  },
  {
    label: "Modérément complexe",
    value: 2,
    factor: 1.25,
  },
  {
    label: "Complexe",
    value: 3,
    factor: 1.5,
  },
  {
    label: "Très complexe",
    value: 4,
    factor: 1.75,
  },
];
