// src/schemas/listing.ts - UAKTUALNIONA WERSJA
import { z } from "zod";

export const listingFormSchema = z
  .object({
    title: z.string().min(5, "Tytuł musi mieć co najmniej 5 znaków").max(100),
    description: z
      .string()
      .min(10, "Opis musi mieć co najmniej 10 znaków")
      .max(500)
      .optional(),
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
    price_per_unit: z.number().min(0).optional(),
    unit: z.enum(["kg", "item", "bundle", "dozen", "liter"]),
    estimated_amount: z.number().min(1).optional(),
    available_from: z.string().min(1, "Data dostępności jest wymagana"),
    available_until: z.string().optional(),
    rescue_reason: z.string().optional(),
    pickup_instructions: z.string().optional(),
    farm_id: z.string().min(1, "Wybór gospodarstwa jest wymagany"),
  })
  .refine(
    (data) => {
      // Jeśli to NIE jest akcja ratunkowa, cena jest wymagana
      if (data.price_type !== "rescue") {
        return data.price_per_unit !== undefined && data.price_per_unit > 0;
      }
      return true;
    },
    {
      message: "Cena jest wymagana dla zwykłych ogłoszeń",
      path: ["price_per_unit"],
    }
  )
  .refine(
    (data) => {
      // Dla akcji ratunkowych, rescue_reason jest wymagane
      if (data.price_type === "rescue") {
        return data.rescue_reason && data.rescue_reason.length > 10;
      }
      return true;
    },
    {
      message: "Powód akcji ratunkowej jest wymagany (min. 10 znaków)",
      path: ["rescue_reason"],
    }
  );
