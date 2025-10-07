import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";
import type { Listing } from "@/types/listings";

async function deleteImageByUrl(imageUrl: string): Promise<void> {
  try {
    const urlObj = new URL(imageUrl);
    const pathParts = urlObj.pathname.split("/");
    const bucketIndex = pathParts.indexOf("listing-images");

    if (bucketIndex !== -1) {
      const filePath = pathParts.slice(bucketIndex + 1).join("/");

      const { error } = await supabase.storage
        .from("listing-images")
        .remove([filePath]);

      if (error) throw error;
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

        const transformedData =
          data?.map((item) => {
            let latitude = 0;
            let longitude = 0;

            if (item.location) {
              if (item.location.coordinates) {
                const [lng, lat] = item.location.coordinates;
                latitude = lat;
                longitude = lng;
              } else if (item.location.x && item.location.y) {
                latitude = item.location.y;
                longitude = item.location.x;
              } else if (
                typeof item.location === "string" &&
                item.location.includes("POINT")
              ) {
                const match = item.location.match(/POINT\(([^ ]+) ([^ ]+)\)/);
                if (match) {
                  longitude = parseFloat(match[1]);
                  latitude = parseFloat(match[2]);
                }
              }
            }

            if (latitude === 0 && longitude === 0) {
              console.warn("⚠️ Brak współrzędnych dla ogłoszenia:", item.id);
              latitude = 52.0;
              longitude = 19.0;
            }

            const transformed = {
              ...item,
              latitude,
              longitude,
              user: item.profiles,
            };

            return transformed;
          }) || [];

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

async function uploadImage(file: File, listingId: string): Promise<string> {
  try {
    const fileExt = file.name.split(".").pop() || "webp";
    const fileName = `${listingId}/image-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("listing-images")
      .upload(fileName, file, {
        upsert: true,
        cacheControl: "3600",
      });

    if (error) {
      console.error("❌ STORAGE UPLOAD ERROR:", error);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from("listing-images")
      .getPublicUrl(fileName);

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
        contact_email: listingData.contact_email,
        contact_phone: listingData.contact_phone,
        requires_approval: listingData.requires_approval,
        approved_by_admin: false,
        status,
        user_id: user?.id || null,
      };

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

export function useUpdateListing() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      if (!user) throw new Error("Musisz być zalogowany");

      const { data: currentListing } = await supabase
        .from("listings")
        .select("images")
        .eq("id", id)
        .single();

      const currentImages = currentListing?.images || [];

      let finalImages = updates.images || [];

      if (updates.new_image) {
        // Usuń stare zdjęcia z storage
        if (currentImages.length > 0) {
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
          finalImages = [newImageUrl];
        } catch (uploadError) {
          console.error("❌ IMAGE UPLOAD FAILED:", uploadError);
          finalImages = currentImages;
        }
      } else if (updates.images && updates.images.length === 0) {
        if (currentImages.length > 0) {
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
        contact_phone: updates.contact_phone,
        contact_email: updates.contact_email,
        images: finalImages,
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
      console.error("❌ MUTATION ERROR:", error);
      toast.error("❌ Błąd aktualizacji ogłoszenia");
    },
  });
}
