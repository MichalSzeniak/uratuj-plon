// src/components/profile/UserListings.tsx
import { useState } from "react";
import { useUserListings, useDeleteListing } from "@/hooks/useUserListings";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2, MapPin, Calendar } from "lucide-react";
import { EditListingModal } from "./EditListingModal";

export function UserListings() {
  const { data: listings, isLoading, error } = useUserListings();
  const deleteListing = useDeleteListing();
  const [editingListing, setEditingListing] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { label: "Aktywne", variant: "default" as const },
      pending: { label: "Oczekuje", variant: "secondary" as const },
      sold: { label: "Sprzedane", variant: "outline" as const },
      expired: { label: "Wygasłe", variant: "destructive" as const },
    };

    const config =
      variants[status as keyof typeof variants] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriceTypeBadge = (priceType: string) => {
    const types = {
      normal: { label: "💰 Normalna", variant: "default" as const },
      rescue: { label: "🚨 Ratunkowa", variant: "destructive" as const },
      pick_your_own: { label: "🌱 Zbierz sam", variant: "secondary" as const },
    };

    const config = types[priceType as keyof typeof types] || types.normal;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return <ListingsSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Błąd ładowania ogłoszeń</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            Spróbuj ponownie
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-muted-foreground">
            Moje Ogłoszenia
          </h2>
          <p className="text-muted-foreground">
            Zarządzaj swoimi ogłoszeniami i akcjami ratunkowymi
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {listings?.length || 0} ogłoszeń
        </div>
      </div>

      <div className="space-y-4">
        {listings?.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">Brak ogłoszeń</h3>
            <p className="text-muted-foreground mb-4">
              Nie masz jeszcze żadnych ogłoszeń. Dodaj pierwsze!
            </p>
            <Button>Dodaj pierwsze ogłoszenie</Button>
          </Card>
        ) : (
          listings?.map((listing) => (
            <Card
              key={listing.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-2xl">
                          {listing.product_type === "vegetables" && "🥦"}
                          {listing.product_type === "fruits" && "🍎"}
                          {listing.product_type === "grains" && "🌾"}
                          {listing.product_type === "honey" && "🍯"}
                          {listing.product_type === "eggs" && "🥚"}
                          {listing.product_type === "dairy" && "🧀"}
                          {listing.product_type === "meat" && "🥩"}
                          {listing.product_type === "preserves" && "🥫"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-muted-foreground mb-1">
                          {listing.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {getStatusBadge(listing.status)}
                          {getPriceTypeBadge(listing.price_type)}
                          <Badge variant="outline">
                            {listing.product_type}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          {listing.price_per_unit
                            ? `${listing.price_per_unit} zł/${listing.unit}`
                            : "Za darmo"}
                        </div>
                        {listing.estimated_amount && (
                          <div className="text-sm text-gray-500">
                            {listing.estimated_amount} {listing.unit}
                          </div>
                        )}
                      </div>
                    </div>

                    {listing.description && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {listing.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          od{" "}
                          {new Date(listing.available_from).toLocaleDateString(
                            "pl-PL"
                          )}
                        </span>
                      </div>
                      {listing.available_until && (
                        <div className="flex items-center gap-1">
                          <span>
                            do{" "}
                            {new Date(
                              listing.available_until
                            ).toLocaleDateString("pl-PL")}
                          </span>
                        </div>
                      )}
                    </div>

                    {listing.rescue_reason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-800 mb-1">
                          ⚠️ Powód akcji ratunkowej:
                        </p>
                        <p className="text-sm text-red-700">
                          {listing.rescue_reason}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingListing(listing)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edytuj
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (
                          confirm("Czy na pewno chcesz usunąć to ogłoszenie?")
                        ) {
                          deleteListing.mutate(listing.id);
                        }
                      }}
                      disabled={deleteListing.isPending}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Usuń
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <EditListingModal
        listing={editingListing}
        isOpen={!!editingListing}
        onClose={() => setEditingListing(null)}
      />
    </div>
  );
}

function ListingsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex gap-4">
            <Skeleton className="w-20 h-20 rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
