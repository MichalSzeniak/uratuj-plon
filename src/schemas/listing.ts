// src/schemas/listing.ts - DODAJ OBSŁUGĘ ZDJĘĆ
import { z } from "zod";

export const listingFormSchema = z
  .object({
    title: z
      .string()
      .min(3, "Tytuł musi mieć co najmniej 3 znaki")
      .max(100, "Tytuł może mieć maksymalnie 100 znaków"),
    description: z
      .string()
      .min(10, "Opis musi mieć co najmniej 10 znaków")
      .max(1000, "Opis może mieć maksymalnie 1000 znaków"),
    product_type: z.enum([
      "vegetables",
      "fruits",
      "grains",
      "honey",
      "eggs",
      "dairy",
      "meat",
      "preserves",
      "other",
    ]),
    price_type: z.enum(["normal", "rescue", "pick_your_own"]),
    price_per_unit: z
      .number()
      .min(0, "Cena nie może być ujemna")
      .optional()
      .or(z.literal(0)),
    unit: z.enum(["kg", "item", "bundle", "dozen", "liter"]),
    estimated_amount: z
      .number()
      .min(1, "Ilość musi być większa niż 0")
      .optional()
      .or(z.literal(0)),
    address: z.string().min(5, "Adres musi mieć co najmniej 5 znaków"),
    available_from: z.string().min(1, "Data rozpoczęcia jest wymagana"),
    available_until: z.string().optional().or(z.literal("")),
    rescue_reason: z.string().optional().or(z.literal("")),
    pickup_instructions: z.string().optional().or(z.literal("")),
    city: z.string().optional().or(z.literal("")),
    region: z.string().optional().or(z.literal("")),
    // WRÓĆ DO images - ale używaj jako tablicy z jednym elementem
    images: z
      .array(z.string())
      .max(1, "Możesz dodać tylko jedno zdjęcie")
      .optional()
      .default([]),
  })
  .refine(
    (data) => {
      if (data.available_until && data.available_from) {
        return new Date(data.available_until) >= new Date(data.available_from);
      }
      return true;
    },
    {
      message: "Data zakończenia musi być po dacie rozpoczęcia",
      path: ["available_until"],
    }
  );

export type ListingFormData = z.infer<typeof listingFormSchema>;

// NOWY: Typ dla danych przesyłanych do mutacji
export interface ListingMutationData {
  title: string;
  description: string;
  product_type: string;
  price_type: string;
  price_per_unit: number | null;
  unit: string;
  estimated_amount: number | null;
  address: string;
  location: string;
  available_from: string;
  available_until: string | null;
  rescue_reason: string | null;
  pickup_instructions: string | null;
  city?: string;
  region?: string;
  images?: string[]; // Zaktualizowane zdjęcia
  new_images?: File[]; // Nowe zdjęcia do uploadu
}
