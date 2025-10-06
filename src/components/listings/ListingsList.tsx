// src/components/listings/ListingsList.tsx - NOWA WERSJA
import { useState } from "react";
import { useListings } from "@/hooks/useListings";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Image as ImageIcon,
  User,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ListingsList() {
  const { data: listings, isLoading, error } = useListings();
  const [searchTerm, setSearchTerm] = useState("");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [priceTypeFilter, setPriceTypeFilter] = useState<string>("all");

  // Filtrowanie ogłoszeń
  const filteredListings =
    listings?.filter((listing) => {
      const matchesSearch =
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProduct =
        productFilter === "all" || listing.product_type === productFilter;
      const matchesPriceType =
        priceTypeFilter === "all" || listing.price_type === priceTypeFilter;

      return matchesSearch && matchesProduct && matchesPriceType;
    }) || [];

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
    <div className="space-y-4">
      {/* Filtry i wyszukiwarka */}
      <Card className="p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Wyszukiwarka */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Szukaj produktów, adresów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>

          {/* Filtry */}
          <div className="flex gap-2">
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-[140px] h-10">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Produkt" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="vegetables">Warzywa</SelectItem>
                <SelectItem value="fruits">Owoce</SelectItem>
                <SelectItem value="grains">Zboża</SelectItem>
                <SelectItem value="honey">Miód</SelectItem>
                <SelectItem value="eggs">Jaja</SelectItem>
                <SelectItem value="dairy">Nabiał</SelectItem>
                <SelectItem value="meat">Mięso</SelectItem>
                <SelectItem value="preserves">Przetwory</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceTypeFilter} onValueChange={setPriceTypeFilter}>
              <SelectTrigger className="w-[130px] h-10">
                <SelectValue placeholder="Oferta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="normal">Normalna</SelectItem>
                <SelectItem value="rescue">Ratunkowa</SelectItem>
                <SelectItem value="pick_your_own">Zbierz sam</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Statystyki */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center">
          <div className="text-lg font-bold text-green-600">
            {listings?.length || 0}
          </div>
          <div className="text-xs text-gray-600">Ogłoszenia</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-lg font-bold text-red-600">
            {listings?.filter((l) => l.price_type === "rescue").length || 0}
          </div>
          <div className="text-xs text-gray-600">Ratunkowe</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-lg font-bold text-blue-600">
            {listings?.filter((l) => l.price_type === "pick_your_own").length ||
              0}
          </div>
          <div className="text-xs text-gray-600">Zbierz sam</div>
        </Card>
      </div>

      {/* Lista ogłoszeń */}
      <div className="space-y-3">
        {filteredListings.length === 0 ? (
          <Card className="p-6 text-center">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-base font-semibold mb-1">Brak ogłoszeń</h3>
            <p className="text-sm text-gray-600">
              {searchTerm ||
              productFilter !== "all" ||
              priceTypeFilter !== "all"
                ? "Spróbuj zmienić kryteria wyszukiwania"
                : "Jeszcze nie ma ogłoszeń"}
            </p>
          </Card>
        ) : (
          filteredListings.map((listing) => (
            <CompactListingCard key={listing.id} listing={listing} />
          ))
        )}
      </div>
    </div>
  );
}

// KOMPAKTOWA KARTA OGŁOSZENIA - ZAKTUALIZOWANA
function CompactListingCard({ listing }: { listing: any }) {
  const getProductIcon = (type: string) => {
    const icons = {
      vegetables: "🥦",
      fruits: "🍎",
      grains: "🌾",
      honey: "🍯",
      eggs: "🥚",
      dairy: "🧀",
      meat: "🥩",
      preserves: "🥫",
      other: "📦",
    };
    return icons[type as keyof typeof icons] || "📦";
  };

  const getPriceTypeVariant = (type: string) => {
    return type === "rescue"
      ? "destructive"
      : type === "pick_your_own"
      ? "default"
      : "secondary";
  };

  const hasImages = listing.images && listing.images.length > 0;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer border">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* ZDJĘCIE */}
          <div className="flex-shrink-0 relative">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {hasImages ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-2xl">
                  {getProductIcon(listing.product_type)}
                </div>
              )}
            </div>
            {/* Indicator jeśli są zdjęcia */}
            {hasImages && listing.images.length > 1 && (
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                +{listing.images.length - 1}
              </div>
            )}
          </div>

          {/* TREŚĆ */}
          <div className="flex-1 min-w-0">
            {/* Nagłówek z tytułem i ceną */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                  {listing.title}
                </h3>

                {/* Użytkownik */}
                <div className="flex items-center gap-2 mt-1 mb-1">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span className="truncate max-w-[120px]">
                      {listing.user?.full_name ||
                        listing.user?.username ||
                        "Anonim"}
                    </span>
                  </div>
                </div>

                {/* Badge'e */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant={getPriceTypeVariant(listing.price_type)}
                    className="text-xs"
                  >
                    {listing.price_type === "rescue" && "🚨"}
                    {listing.price_type === "pick_your_own" && "🌱"}
                    {listing.price_type === "normal" && "💰"}
                  </Badge>

                  <Badge variant="outline" className="text-xs">
                    {getProductIcon(listing.product_type)}{" "}
                    {listing.product_type}
                  </Badge>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-green-600 whitespace-nowrap">
                  {listing.price_per_unit
                    ? `${listing.price_per_unit} zł`
                    : "Za darmo"}
                </div>
                <div className="text-xs text-gray-500">
                  {listing.unit}
                  {listing.estimated_amount && ` • ${listing.estimated_amount}`}
                </div>
              </div>
            </div>

            {/* Opis */}
            {listing.description && (
              <p className="text-gray-600 text-xs mb-2 line-clamp-2 leading-relaxed">
                {listing.description}
              </p>
            )}

            {/* Metadane */}
            <div className="space-y-1">
              {/* Linia 1: Lokalizacja i data */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span
                    className="truncate max-w-[120px]"
                    title={listing.address}
                  >
                    {listing.address}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    od{" "}
                    {new Date(listing.available_from).toLocaleDateString(
                      "pl-PL",
                      {
                        day: "2-digit",
                        month: "2-digit",
                      }
                    )}
                  </span>
                </div>
              </div>

              {/* Linia 2: Dodatkowe informacje */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {listing.pickup_instructions && (
                  <span
                    className="truncate max-w-[150px]"
                    title={listing.pickup_instructions}
                  >
                    📋 {listing.pickup_instructions}
                  </span>
                )}

                {/* Indicator zdjęć */}
                {hasImages && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <ImageIcon className="h-3 w-3" />
                    <span>{listing.images.length} zdj.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Powód akcji ratunkowej */}
            {listing.rescue_reason && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                <p className="font-medium text-red-800 mb-1">
                  ⚠️ Powód ratunkowy:
                </p>
                <p className="text-red-700 line-clamp-2">
                  {listing.rescue_reason}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// SKELETON ŁADOWANIA
function ListingsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Skeleton filtrów */}
      <Card className="p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10 flex-1" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[140px]" />
            <Skeleton className="h-10 w-[130px]" />
          </div>
        </div>
      </Card>

      {/* Skeleton statystyk */}
      <div className="grid grid-cols-3 gap-2">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-3">
            <Skeleton className="h-6 w-8 mx-auto mb-1" />
            <Skeleton className="h-4 w-12 mx-auto" />
          </Card>
        ))}
      </div>

      {/* Skeleton listy */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex gap-3">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex gap-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
