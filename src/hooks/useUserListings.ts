// src/hooks/useUserListings.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";

export function useUserListings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-listings", user?.id],
    queryFn: async () => {
      if (!user) return [];

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

export function useUpdateListing() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      if (!user) throw new Error("Musisz być zalogowany");

      const { data, error } = await supabase
        .from("listings")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        console.error("❌ Błąd aktualizacji ogłoszenia:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("✅ Ogłoszenie zaktualizowane");
    },
    onError: () => {
      toast.error("❌ Błąd aktualizacji ogłoszenia");
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      if (!user) throw new Error("Musisz być zalogowany");

      const { data, error } = await supabase
        .from("listings")
        .update({
          title: updates.title,
          description: updates.description,
          product_type: updates.product_type,
          price_type: updates.price_type,
          price_per_unit: updates.price_per_unit,
          unit: updates.unit,
          estimated_amount: updates.estimated_amount,
          address: updates.address,
          latitude: updates.latitude,
          longitude: updates.longitude,
          available_from: updates.available_from,
          available_until: updates.available_until,
          rescue_reason: updates.rescue_reason,
          pickup_instructions: updates.pickup_instructions,
          city: updates.city,
          region: updates.region,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        console.error("❌ Błąd aktualizacji ogłoszenia:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-listings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("🗑️ Ogłoszenie usunięte");
    },
    onError: () => {
      toast.error("❌ Błąd usuwania ogłoszenia");
    },
  });
}
