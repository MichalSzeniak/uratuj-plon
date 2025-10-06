// hooks/useListingsSimple.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";

export function useUpdateListingSimple() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      if (!user) throw new Error("Musisz być zalogowany");

      console.log("🔄 Updating listing:", { id, updates });

      // Upload nowego zdjęcia jeśli jest
      let images = updates.images || [];

      if (updates.new_image) {
        console.log("📸 Uploading new image");
        try {
          const imageUrl = await uploadSingleImage(updates.new_image, id);
          images = [imageUrl]; // Zastąp wszystkie zdjęcia nowym
        } catch (error) {
          console.error("❌ Image upload failed:", error);
        }
      }

      const updateData = {
        title: updates.title,
        description: updates.description,
        product_type: updates.product_type,
        price_type: updates.price_type,
        price_per_unit: updates.price_per_unit,
        unit: updates.unit,
        estimated_amount: updates.estimated_amount,
        address: updates.address,
        location: updates.location,
        available_from: updates.available_from,
        available_until: updates.available_until,
        rescue_reason: updates.rescue_reason,
        pickup_instructions: updates.pickup_instructions,
        images: images,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("listings")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["user-listings"] });
      toast.success("✅ Ogłoszenie zaktualizowane!");
    },
    onError: (error) => {
      toast.error("❌ Błąd aktualizacji");
    },
  });
}

// Prosta funkcja uploadu
async function uploadSingleImage(
  file: File,
  listingId: string
): Promise<string> {
  const fileExt = file.name.split(".").pop() || "webp";
  const fileName = `${listingId}/image-${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("listing-images")
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("listing-images").getPublicUrl(fileName);

  return publicUrl;
}
