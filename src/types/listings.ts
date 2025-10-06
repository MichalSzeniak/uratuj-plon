// src/types/listings.ts - UAKTUALNIONA WERSJA
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
  title: string;
  description?: string;
  product_type: ProductType;
  price_type: PriceType;
  price_per_unit?: number;
  unit: UnitType;
  estimated_amount?: number;
  available_from: string;
  available_until?: string;
  rescue_reason?: string;
  pickup_instructions?: string;
  farm_id: string;
}

export interface Listing extends ListingFormData {
  id: string;
  status: ListingStatus;
  farmer_id: string;
  created_at: string;
  updated_at: string;
}
