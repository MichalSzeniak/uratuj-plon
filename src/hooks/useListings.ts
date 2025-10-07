import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";
import type { Listing } from "@/types/listings";
// import { deleteImageByUrl, deleteImagesFromStorage, deleteSingleImage } from "@/lib/storage";

async function deleteImageByUrl(imageUrl: string): Promise<void> {
  try {
    // Wyodrębnij ścieżkę z URL
    const urlObj = new URL(imageUrl);
    const pathParts = urlObj.pathname.split("/");
    const bucketIndex = pathParts.indexOf("listing-images");

    if (bucketIndex !== -1) {
      const filePath = pathParts.slice(bucketIndex + 1).join("/");
      console.log("🗑️ Deleting image by URL:", filePath);

      const { error } = await supabase.storage
        .from("listing-images")
        .remove([filePath]);

      if (error) throw error;
      console.log("✅ Image deleted from storage");
    }
  } catch (error) {
    console.error("❌ Failed to delete image by URL:", error);
    throw error;
  }
}

export function useListings() {
  return useQuery({
    queryKey: ["listings"],
    queryFn: async (): Promise<Listing[]> => {
      console.log("📋 Pobieranie wszystkich ogłoszeń...");

      try {
        const { data, error } = await supabase
          .from("listings")
          .select(
            `
            *,
            profiles:user_id (
              username,
              full_name,
              avatar_url
            )
          `
          )
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("❌ Błąd pobierania ogłoszeń:", error);
          throw error;
        }

        console.log("✅ Pobrano ogłoszenia z bazy:", data);

        // POPRAWIONA TRANSFORMACJA DANYCH
        const transformedData =
          data?.map((item) => {
            console.log("🔍 Przetwarzanie item:", item);

            let latitude = 0;
            let longitude = 0;

            // RÓŻNE FORMATY location Z PostGIS
            if (item.location) {
              if (item.location.coordinates) {
                // Format: { coordinates: [lng, lat] }
                const [lng, lat] = item.location.coordinates;
                latitude = lat;
                longitude = lng;
                console.log(`📍 Coordinates: ${lat}, ${lng}`);
              } else if (item.location.x && item.location.y) {
                // Format: { x: lng, y: lat }
                latitude = item.location.y;
                longitude = item.location.x;
                console.log(`📍 XY: ${item.location.y}, ${item.location.x}`);
              } else if (
                typeof item.location === "string" &&
                item.location.includes("POINT")
              ) {
                // Format: "POINT(lng lat)"
                const match = item.location.match(/POINT\(([^ ]+) ([^ ]+)\)/);
                if (match) {
                  longitude = parseFloat(match[1]);
                  latitude = parseFloat(match[2]);
                  console.log(`📍 String POINT: ${latitude}, ${longitude}`);
                }
              }
            }

            // Jeśli nadal nie mamy współrzędnych, użyj domyślnych
            if (latitude === 0 && longitude === 0) {
              console.warn("⚠️ Brak współrzędnych dla ogłoszenia:", item.id);
              // Domyślne współrzędne Polski
              latitude = 52.0;
              longitude = 19.0;
            }

            const transformed = {
              ...item,
              latitude,
              longitude,
              user: item.profiles,
            };

            console.log("🔄 Transformed:", transformed);
            return transformed;
          }) || [];

        console.log("🎯 Final transformed data:", transformedData);
        return transformedData;
      } catch (error) {
        console.error("💥 Caught error in useListings:", error);
        throw error;
      }
    },
  });
}

export function useUserListings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["listings", "user", user?.id],
    queryFn: async (): Promise<Listing[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Błąd pobierania ogłoszeń użytkownika:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
}

// Funkcja uploadu zdjęć
async function uploadImage(file: File, listingId: string): Promise<string> {
  console.log("🚀 UPLOAD_IMAGE called:", {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    listingId,
  });

  try {
    const fileExt = file.name.split(".").pop() || "webp";
    const fileName = `${listingId}/image-${Date.now()}.${fileExt}`;

    console.log("📝 Uploading to:", fileName);

    const { data, error } = await supabase.storage
      .from("listing-images")
      .upload(fileName, file, {
        upsert: true,
        cacheControl: "3600",
      });

    if (error) {
      console.error("❌ STORAGE UPLOAD ERROR:", error);
      throw error;
    }

    console.log("✅ STORAGE UPLOAD SUCCESS:", data);

    const { data: urlData } = supabase.storage
      .from("listing-images")
      .getPublicUrl(fileName);

    console.log("🔗 PUBLIC URL:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error("💥 UPLOAD FAILED:", error);
    throw error;
  }
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (listingData: any & { images?: File[] }) => {
      console.log("🔄 useCreateListing - guest mode:", !user);

      const status = listingData.requires_approval ? "pending" : "active";

      const listingPayload = {
        title: listingData.title,
        description: listingData.description || null,
        product_type: listingData.product_type,
        price_type: listingData.price_type,
        price_per_unit: listingData.price_per_unit || null,
        unit: listingData.unit,
        estimated_amount: listingData.estimated_amount || null,
        address: listingData.address,
        city: listingData.city || null,
        region: listingData.region || null,
        location: listingData.location,
        available_from: listingData.available_from,
        available_until: listingData.available_until || null,
        rescue_reason: listingData.rescue_reason || null,
        pickup_instructions: listingData.pickup_instructions || null,
        is_guest_listing: listingData.is_guest_listing,
        guest_contact_email: listingData.guest_contact_email,
        guest_contact_phone: listingData.guest_contact_phone,
        requires_approval: listingData.requires_approval,
        approved_by_admin: false,
        status,
        user_id: user?.id || null,
      };

      console.log("📤 Sending to Supabase:", listingPayload);

      const { data, error } = await supabase
        .from("listings")
        .insert(listingPayload)
        .select()
        .single();

      if (error) throw error;

      if (listingData.new_image) {
        try {
          const imageUrl = await uploadImage(listingData.new_image, data.id);
          await supabase
            .from("listings")
            .update({ images: [imageUrl] })
            .eq("id", data.id);
        } catch (uploadError) {
          console.error("❌ Image upload failed:", uploadError);
        }
      }

      return data;
    },
    onSuccess: (data) => {
      console.log("🎉 Mutation successful:", data.status);
      queryClient.invalidateQueries({ queryKey: ["listings"] });

      if (data.status === "pending") {
        toast.success("📝 Ogłoszenie wysłane do zatwierdzenia!", {
          description: "Sprawdzimy je i opublikujemy w ciągu 24 godzin",
          duration: 6000,
        });
      } else {
        toast.success("✅ Ogłoszenie dodane!", {
          description: "Twoje ogłoszenie jest już widoczne na mapie",
        });
      }
    },
    onError: (error) => {
      console.error("❌ Mutation error:", error);
      toast.error("❌ Błąd dodawania ogłoszenia");
    },
  });
}

async function uploadImages(
  files: File[],
  listingId: string
): Promise<string[]> {
  console.log("🚀 UPLOAD_IMAGES STARTED");
  console.log("📁 Files to upload:", files);
  console.log("🏷️ Listing ID:", listingId);

  if (!files || files.length === 0) {
    console.log("📭 No files provided to uploadImages");
    return [];
  }

  // Sprawdź czy files to prawdziwe File objects
  console.log("🔍 File validation:");
  files.forEach((file, index) => {
    console.log(`File ${index}:`, {
      name: file.name,
      size: file.size,
      type: file.type,
      constructor: file.constructor.name,
      isFile: file instanceof File,
      isBlob: file instanceof Blob,
      hasData: file.size > 0,
    });
  });

  const uploadedUrls: string[] = [];

  try {
    for (const [index, file] of files.entries()) {
      console.log(
        `\n📤 UPLOADING FILE ${index + 1}/${files.length}: ${file.name}`
      );

      // Sprawdź czy plik ma dane
      if (file.size === 0) {
        console.error("❌ File is empty:", file.name);
        continue;
      }

      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${listingId}/image-${Date.now()}-${index}.${fileExt}`;

      console.log("📝 Uploading to:", fileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(fileName, file);

      if (uploadError) {
        console.error("❌ UPLOAD ERROR:", uploadError);
        continue;
      }

      console.log("✅ UPLOAD SUCCESS:", uploadData);

      const {
        data: { publicUrl },
      } = supabase.storage.from("listing-images").getPublicUrl(fileName);

      console.log("🔗 PUBLIC URL:", publicUrl);
      uploadedUrls.push(publicUrl);
    }

    console.log("🎉 UPLOAD COMPLETED. URLs:", uploadedUrls);
    return uploadedUrls;
  } catch (error) {
    console.error("💥 UPLOAD FAILED:", error);
    return [];
  }
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      if (!user) throw new Error("Musisz być zalogowany");

      console.log("🎯 UPDATE MUTATION - received:", {
        id,
        hasNewImage: !!updates.new_image,
        currentImages: updates.images,
        removedExistingImage: updates.images?.length === 0, // ★ DODAJ TEN LOG
      });

      // ★ WAŻNE: Pobierz aktualne ogłoszenie żeby sprawdzić stare zdjęcia
      const { data: currentListing } = await supabase
        .from("listings")
        .select("images")
        .eq("id", id)
        .single();

      const currentImages = currentListing?.images || [];
      console.log("📸 CURRENT IMAGES IN DB:", currentImages);

      let finalImages = updates.images || [];

      if (updates.new_image) {
        console.log("📸 UPLOADING NEW IMAGE - deleting old ones");

        // Usuń stare zdjęcia z storage
        if (currentImages.length > 0) {
          console.log("🗑️ Deleting old images from storage");
          for (const oldImageUrl of currentImages) {
            try {
              await deleteImageByUrl(oldImageUrl);
            } catch (error) {
              console.error("❌ Failed to delete old image:", error);
            }
          }
        }

        try {
          const newImageUrl = await uploadImage(updates.new_image, id);
          console.log("✅ NEW IMAGE UPLOADED:", newImageUrl);
          finalImages = [newImageUrl];
        } catch (uploadError) {
          console.error("❌ IMAGE UPLOAD FAILED:", uploadError);
          finalImages = currentImages;
        }
      } else if (updates.images && updates.images.length === 0) {
        console.log("🗑️ USER REMOVED EXISTING IMAGE - clearing images");

        if (currentImages.length > 0) {
          console.log("🗑️ Deleting images from storage");
          for (const oldImageUrl of currentImages) {
            try {
              await deleteImageByUrl(oldImageUrl);
            } catch (error) {
              console.error("❌ Failed to delete image:", error);
            }
          }
        }

        finalImages = [];
      } else {
        console.log("📸 NO IMAGE CHANGES - keeping current images");
        finalImages = currentImages;
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
        images: finalImages,
        updated_at: new Date().toISOString(),
      };

      console.log("📤 SENDING TO SUPABASE:", updateData);

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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["user-listings"] });
      toast.success("✅ Ogłoszenie zaktualizowane!");
    },
    onError: (error) => {
      console.error("❌ MUTATION ERROR:", error);
      toast.error("❌ Błąd aktualizacji ogłoszenia");
    },
  });
}
