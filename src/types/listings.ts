// src/types/listings.ts - NOWA WERSJA
export type ProductType =
  | "vegetables"
  | "fruits"
  | "grains"
  | "honey"
  | "eggs"
  | "dairy"
  | "meat"
  | "preserves"
  | "other";

export type PriceType = "normal" | "rescue" | "pick_your_own";
export type UnitType = "kg" | "item" | "bundle" | "dozen" | "liter";
export type ListingStatus = "active" | "inactive" | "pending" | "completed";

export interface ListingFormData {
  // Podstawowe informacje
  title: string;
  description?: string;
  product_type: ProductType;

  // Cena i oferta
  price_type: PriceType;
  price_per_unit?: number;
  unit: UnitType;
  estimated_amount?: number;

  // Lokalizacja (NOWE - zamiast farm_id)
  address: string;
  city?: string;
  region?: string;
  latitude: number;
  longitude: number;

  // Daty dostępności
  available_from: string;
  available_until?: string;

  // Specjalne pola
  rescue_reason?: string;
  pickup_instructions?: string;
}

export interface Listing extends ListingFormData {
  id: string;
  user_id: string;
  status: ListingStatus;
  images?: string[];
  created_at: string;
  updated_at: string;
}
