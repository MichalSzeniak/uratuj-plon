import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShareButton } from "@/components/ShareButton";
import { toast } from "sonner";
import { ListingGallery } from "@/components/listing/ListingGallery";
import { ListingContact } from "@/components/listing/ListingContact";
import { MapNavigation } from "@/components/listing/MapNavigation";
import { ArrowLeft, Package } from "lucide-react";
import SEO from "@/components/SEO";

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
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUrl = `https://ratujplon.pl${location.pathname}`;

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie ogłoszenia...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ogłoszenie nie znalezione
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "To ogłoszenie może zostać usunięte lub nie istnieje."}
          </p>
          <Link to="/">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Wróć do mapy
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const productTypeLabels: { [key: string]: string } = {
    vegetables: "🥦 Warzywa",
    fruits: "🍎 Owoce",
    grains: "🌾 Zboża",
    honey: "🍯 Miód",
    eggs: "🥚 Jaja",
    dairy: "🧀 Nabiał",
    meat: "🥩 Mięso",
    preserves: "🥫 Przetwory",
  };

  return (
    <>
      <SEO
        url={currentUrl}
        title={`RatujPlon - ${listing.title} w ${listing.address} | Kup lub oddaj plony`}
        description={`Rolnik z ${listing.address} oferuje ${listing.title}. Kupuj lokalnie lub przekaż nadwyżki plonów i wspieraj lokalne gospodarstwa. Sprawdź ofertę na RatujPlon!`}
      />

      <section className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Wróć do mapy
              </Link>
              <ShareButton listing={listing} />
            </div>

            <div className="hidden lg:block mt-3">
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
                  {productTypeLabels[listing.product_type] ||
                    listing.product_type}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <ListingGallery images={listing.images} title={listing.title} />

              <div className="lg:hidden">
                <Card>
                  <CardContent className="p-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {listing.title}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary">
                        {listing.user?.full_name ||
                          listing.user?.username ||
                          "Anonim"}
                      </Badge>
                      {listing.price_type === "rescue" && (
                        <Badge variant="destructive">🚨 Ratunkowe</Badge>
                      )}
                      <Badge variant="outline" className="capitalize">
                        {productTypeLabels[listing.product_type] ||
                          listing.product_type}
                      </Badge>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-800">
                          {listing.price_per_unit
                            ? `${listing.price_per_unit} zł/${listing.unit}`
                            : "Za darmo"}
                        </span>
                        {listing.estimated_amount && (
                          <span className="text-sm text-green-700">
                            {listing.estimated_amount} {listing.unit} dostępne
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:hidden space-y-4">
                <ListingContact listing={listing} />
              </div>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Opis</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
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
                    <p className="text-gray-700 whitespace-pre-line">
                      {listing.pickup_instructions}
                    </p>
                  </CardContent>
                </Card>
              )}

              {listing.rescue_reason && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-red-800">
                      ⚠️ Powód akcji ratunkowej
                    </h2>
                    <p className="text-red-700 whitespace-pre-line">
                      {listing.rescue_reason}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <div className="hidden lg:block space-y-4">
                <ListingContact listing={listing} />
                <MapNavigation listing={listing} />
              </div>

              <Card>
                <CardContent className="p-6 py-0">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-gray-600" />
                    Szczegóły oferty
                  </h3>
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
