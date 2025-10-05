// src/hooks/useListings.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import type { Listing } from "@/types/map";

export function useFarmListings(farmId?: string) {
  return useQuery({
    queryKey: ["listings", farmId],
    queryFn: async (): Promise<Listing[]> => {
      if (!farmId) return [];

      console.log("📋 useFarmListings: fetching listings for farm", farmId);

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("farm_id", farmId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ useFarmListings error:", error);
        throw error;
      }

      console.log(
        "✅ useFarmListings: received",
        data?.length || 0,
        "listings"
      );
      return data || [];
    },
    enabled: !!farmId,
  });
}

export function useActiveListings() {
  return useQuery({
    queryKey: ["listings", "active"],
    queryFn: async (): Promise<Listing[]> => {
      console.log("📋 useActiveListings: fetching active listings...");

      const { data, error } = await supabase
        .from("listings")
        .select(
          `
          *,
          farms (
            name,
            address,
            profiles:farmer_id (
              username,
              full_name
            )
          )
        `
        )
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ useActiveListings error:", error);
        throw error;
      }

      console.log(
        "✅ useActiveListings: received",
        data?.length || 0,
        "active listings"
      );
      return data || [];
    },
  });
}

export function useRescueListings() {
  return useQuery({
    queryKey: ["listings", "rescue"],
    queryFn: async (): Promise<Listing[]> => {
      console.log("🚨 useRescueListings: fetching rescue listings...");

      const { data, error } = await supabase
        .from("listings")
        .select(
          `
          *,
          farms (
            name,
            address,
            location,
            profiles:farmer_id (
              username,
              full_name
            )
          )
        `
        )
        .eq("status", "active")
        .eq("price_type", "rescue")
        .order("available_until", { ascending: true }); // Najpierw te z najkrótszym terminem

      if (error) {
        console.error("❌ useRescueListings error:", error);
        throw error;
      }

      console.log(
        "✅ useRescueListings: received",
        data?.length || 0,
        "rescue listings"
      );
      return data || [];
    },
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (listingData: {
      farm_id: string;
      title: string;
      description?: string;
      product_type: Listing["product_type"];
      price_type: Listing["price_type"];
      price_per_unit?: number;
      unit: Listing["unit"];
      estimated_amount?: number;
      available_from: string;
      available_until?: string;
      rescue_reason?: string;
      pickup_instructions?: string;
    }) => {
      if (!user) throw new Error("Musisz być zalogowany aby dodać ogłoszenie");

      console.log("📝 Creating listing:", listingData);

      const { data, error } = await supabase
        .from("listings")
        .insert({
          ...listingData,
          status: "active",
        })
        .select()
        .single();

      if (error) {
        console.error("❌ Create listing error:", error);
        throw error;
      }

      console.log("✅ Listing created:", data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings", data.farm_id] });
      queryClient.invalidateQueries({ queryKey: ["listings", "active"] });
      queryClient.invalidateQueries({ queryKey: ["listings", "rescue"] });
      queryClient.invalidateQueries({ queryKey: ["farms"] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      listingId,
      updates,
    }: {
      listingId: string;
      updates: Partial<Listing>;
    }) => {
      if (!user)
        throw new Error("Musisz być zalogowany aby edytować ogłoszenie");

      const { data, error } = await supabase
        .from("listings")
        .update(updates)
        .eq("id", listingId)
        .select()
        .single();

      if (error) {
        console.error("❌ Update listing error:", error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings", data.farm_id] });
      queryClient.invalidateQueries({ queryKey: ["listings", "active"] });
      queryClient.invalidateQueries({ queryKey: ["listings", "rescue"] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (listingId: string) => {
      if (!user) throw new Error("Musisz być zalogowany aby usunąć ogłoszenie");

      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listingId);

      if (error) {
        console.error("❌ Delete listing error:", error);
        throw error;
      }

      console.log("✅ Listing deleted:", listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings", "active"] });
      queryClient.invalidateQueries({ queryKey: ["listings", "rescue"] });
    },
  });
}
