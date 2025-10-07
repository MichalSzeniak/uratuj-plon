import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function useListingImages() {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (
    file: File,
    listingId: string,
    oldImageUrl?: string | null
  ): Promise<string> => {
    setUploading(true);
    try {
      if (oldImageUrl) {
        try {
          await deleteImage(oldImageUrl);
        } catch (deleteError) {
          console.error(
            "❌ Failed to delete old image, continuing...",
            deleteError
          );
        }
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${listingId}/image-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("listing-images").getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      toast.error("Błąd podczas uploadu zdjęcia");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageUrl: string): Promise<void> => {
    try {
      const urlParts = imageUrl.split("/");
      const filePath = urlParts.slice(-2).join("/");

      const { error } = await supabase.storage
        .from("listing-images")
        .remove([filePath]);

      if (error) throw error;
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
