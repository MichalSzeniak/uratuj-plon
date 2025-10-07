import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { PendingListingCard } from "@/components/admin/PendingListingCard";

export function AdminPage() {
  const queryClient = useQueryClient();

  const { data: pendingListings, isLoading } = useQuery({
    queryKey: ["admin", "pending-listings"],
    queryFn: async () => {
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
        .eq("status", "pending")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const { error } = await supabase
        .from("listings")
        .update({
          status: "active",
          approved_by_admin: true,
          requires_approval: false,
        })
        .eq("id", listingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "pending-listings"],
      });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("✅ Ogłoszenie zatwierdzone!");
    },
    onError: () => {
      toast.error("❌ Błąd podczas zatwierdzania");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const { error } = await supabase
        .from("listings")
        .update({ status: "rejected" })
        .eq("id", listingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "pending-listings"],
      });
      toast.success("🗑️ Ogłoszenie odrzucone");
    },
    onError: () => {
      toast.error("❌ Błąd podczas odrzucania");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie ogłoszeń...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👮 Panel Administratora
          </h1>
          <p className="text-gray-600">
            Zarządzaj ogłoszeniami oczekującymi na zatwierdzenie
          </p>

          <div className="flex gap-4 mt-4">
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Oczekujące</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {pendingListings?.length || 0}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          {pendingListings?.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Brak ogłoszeń do zatwierdzenia
                </h3>
                <p className="text-gray-600">
                  Wszystkie ogłoszenia zostały już przejrzane.
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingListings?.map((listing) => (
              <PendingListingCard
                key={listing.id}
                listing={listing}
                onApprove={() => approveMutation.mutate(listing.id)}
                onReject={() => rejectMutation.mutate(listing.id)}
                isApproving={approveMutation.isPending}
                isRejecting={rejectMutation.isPending}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
