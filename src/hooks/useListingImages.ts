// hooks/useListingImages.ts
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function useListingImages() {
  const [uploading, setUploading] = useState(false);

  // Upload nowego zdjęcia i usuń stare
  const uploadImage = async (
    file: File,
    listingId: string,
    oldImageUrl?: string | null
  ): Promise<string> => {
    setUploading(true);
    try {
      console.log("📤 Uploading new image, deleting old:", oldImageUrl);

      // ★ USUŃ STARE ZDJĘCIE JEŚLI ISTNIEJE
      if (oldImageUrl) {
        try {
          await deleteImage(oldImageUrl);
          console.log("✅ Old image deleted");
        } catch (deleteError) {
          console.error(
            "❌ Failed to delete old image, continuing...",
            deleteError
          );
        }
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${listingId}/image-${Date.now()}.${fileExt}`;

      // Upload nowego zdjęcia
      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Pobierz publiczny URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("listing-images").getPublicUrl(fileName);

      console.log("✅ New image uploaded:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error("❌ Upload failed:", error);
      toast.error("Błąd podczas uploadu zdjęcia");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Usuń zdjęcie
  const deleteImage = async (imageUrl: string): Promise<void> => {
    try {
      const urlParts = imageUrl.split("/");
      const filePath = urlParts.slice(-2).join("/");

      console.log("🗑️ Deleting image:", filePath);

      const { error } = await supabase.storage
        .from("listing-images")
        .remove([filePath]);

      if (error) throw error;
      console.log("✅ Image deleted");
    } catch (error) {
      console.error("❌ Delete failed:", error);
      throw error;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
  };
}
