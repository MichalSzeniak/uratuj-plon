import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShareButton } from "@/components/ShareButton";
import { toast } from "sonner";
import { ListingGallery } from "@/components/listing/ListingGallery";
import { ListingContact } from "@/components/listing/ListingContact";
import { ListingActions } from "@/components/listing/ListingActions";
import { MapNavigation } from "@/components/listing/MapNavigation";

interface Listing {
  id: string;
  title: string;
  description: string;
  product_type: string;
  price_type: string;
  price_per_unit: number | null;
  unit: string;
  estimated_amount: number | null;
  address: string;
  city: string;
  region: string;
  available_from: string;
  available_until: string | null;
  rescue_reason: string | null;
  pickup_instructions: string | null;
  images: string[];
  status: string;
  user_id: string;
  user?: {
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

export function ListingPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      console.log("📋 Fetching listing:", id);

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
        .eq("id", id)
        .single();

      if (error) {
        console.error("❌ Error fetching listing:", error);
        throw error;
      }

      console.log("✅ Listing fetched:", data);
      setListing(data);
    } catch (err: any) {
      console.error("💥 Failed to fetch listing:", err);
      setError(err.message || "Nie udało się załadować ogłoszenia");
      toast.error("Nie udało się załadować ogłoszenia");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie ogłoszenia...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ogłoszenie nie znalezione
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "To ogłoszenie może zostać usunięte lub nie istnieje."}
          </p>
          <Link to="/">
            <Button>← Wróć do strony głównej</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            ← Wróć do mapy
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {listing.title}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">
                  {listing.user?.full_name ||
                    listing.user?.username ||
                    "Anonim"}
                </Badge>
                {listing.price_type === "rescue" && (
                  <Badge variant="destructive">🚨 Akcja Ratunkowa</Badge>
                )}
                <Badge variant="outline" className="capitalize">
                  {listing.product_type}
                </Badge>
              </div>
            </div>
            <ShareButton listing={listing} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ListingGallery images={listing.images} title={listing.title} />

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Opis</h2>
                <p className="text-gray-700 leading-relaxed">
                  {listing.description || "Brak opisu."}
                </p>
              </CardContent>
            </Card>

            {listing.pickup_instructions && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    📋 Instrukcje odbioru
                  </h2>
                  <p className="text-gray-700">{listing.pickup_instructions}</p>
                </CardContent>
              </Card>
            )}

            {listing.rescue_reason && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-red-800">
                    ⚠️ Powód akcji ratunkowej
                  </h2>
                  <p className="text-red-700">{listing.rescue_reason}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <ListingContact listing={listing} />
            <ListingActions listing={listing} />

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">📦 Szczegóły oferty</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cena:</span>
                    <span className="font-semibold">
                      {listing.price_per_unit
                        ? `${listing.price_per_unit} zł/${listing.unit}`
                        : "Za darmo"}
                    </span>
                  </div>

                  {listing.estimated_amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Szacowana ilość:</span>
                      <span>
                        {listing.estimated_amount} {listing.unit}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Dostępne od:</span>
                    <span>
                      {new Date(listing.available_from).toLocaleDateString(
                        "pl-PL"
                      )}
                    </span>
                  </div>

                  {listing.available_until && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dostępne do:</span>
                      <span>
                        {new Date(listing.available_until).toLocaleDateString(
                          "pl-PL"
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">📍 Lokalizacja</h3>
                <p className="text-gray-700">{listing.address}</p>
                {listing.city && (
                  <p className="text-gray-600 mt-1">
                    {listing.city}, {listing.region}
                  </p>
                )}
                <Button variant="outline" className="w-full mt-4">
                  🗺️ Pokaż na mapie
                </Button>
              </CardContent>
            </Card> */}

            {/* Lokalizacja i nawigacja */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">📍 Lokalizacja</h3>
                  <p className="text-gray-700">{listing.address}</p>
                  {listing.city && (
                    <p className="text-gray-600 mt-1">
                      {listing.city}, {listing.region}
                    </p>
                  )}

                  {/* Mini mapa lub static map */}
                  {listing.latitude && listing.longitude && (
                    <div className="mt-4">
                      <img
                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${listing.latitude},${listing.longitude}&zoom=13&size=300x150&markers=color:red%7C${listing.latitude},${listing.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`}
                        alt="Lokalizacja na mapie"
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Kliknij poniżej aby otworzyć nawigację
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Nawigacja */}
              <MapNavigation listing={listing} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
