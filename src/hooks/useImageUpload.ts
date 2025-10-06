import { supabase } from "@/lib/supabase";

// hooks/useImageUpload.ts
export function useImageUpload() {
  const uploadImages = async (files: File[], listingId: string) => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${listingId}/${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Błąd uploadu:", uploadError);
        continue;
      }

      // Pobierz publiczny URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("listing-images").getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  return { uploadImages };
}
