// // src/hooks/useListings.ts - rozszerzamy
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/lib/supabase";
// import { useAuth } from "@/store/auth";
// import { toast } from "sonner";
// import type { ListingFormData } from "@/types/listings";

// export function useCreateListing() {
//   const queryClient = useQueryClient();
//   const { user } = useAuth();

//   return useMutation({
//     mutationFn: async (listingData: ListingFormData) => {
//       if (!user) throw new Error("Musisz być zalogowany");

//       console.log("📝 Tworzenie ogłoszenia:", listingData);

//       // Dla akcji ratunkowych - status pending
//       const status = listingData.price_type === "rescue" ? "pending" : "active";

//       const { data, error } = await supabase
//         .from("listings")
//         .insert({
//           ...listingData,
//           status,
//           farmer_id: user.id,
//         })
//         .select()
//         .single();

//       if (error) {
//         console.error("❌ Błąd tworzenia ogłoszenia:", error);
//         throw error;
//       }

//       return data;
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["listings"] });
//       queryClient.invalidateQueries({ queryKey: ["farms"] });

//       if (data.status === "pending") {
//         toast.success("🎉 Akcja ratunkowa zgłoszona!", {
//           description: "Czeka na zatwierdzenie przez administratora",
//         });
//       } else {
//         toast.success("✅ Ogłoszenie dodane!");
//       }
//     },
//     onError: (error) => {
//       toast.error("❌ Błąd", {
//         description: error.message,
//       });
//     },
//   });
// }

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";
import type { ListingFormData } from "@/types/listings";

export function useCreateListing() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (listingData: ListingFormData) => {
      if (!user) throw new Error("Musisz być zalogowany");

      console.log("📝 Tworzenie ogłoszenia:", listingData);

      // Dla akcji ratunkowych - status pending, dla innych - active
      const status = listingData.price_type === "rescue" ? "pending" : "active";

      const { data, error } = await supabase
        .from("listings")
        .insert({
          ...listingData,
          status,
          farmer_id: user.id,
          // Upewnij się że wszystkie pola są przekazane
          description: listingData.description || null,
          price_per_unit: listingData.price_per_unit || null,
          estimated_amount: listingData.estimated_amount || null,
          available_until: listingData.available_until || null,
          rescue_reason: listingData.rescue_reason || null,
          pickup_instructions: listingData.pickup_instructions || null,
        })
        .select(
          `
          *,
          farms (
            name,
            address
          )
        `
        )
        .single();

      if (error) {
        console.error("❌ Błąd tworzenia ogłoszenia:", error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["farms"] });

      if (data.status === "pending") {
        toast.success("🎉 Akcja ratunkowa zgłoszona!", {
          description: "Czeka na zatwierdzenie przez administratora",
        });
      } else {
        toast.success("✅ Ogłoszenie dodane!");
      }
    },
    onError: (error) => {
      toast.error("❌ Błąd", {
        description: error.message,
      });
    },
  });
}
