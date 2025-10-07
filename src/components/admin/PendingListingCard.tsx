// components/admin/PendingListingCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  AlertTriangle,
  Eye,
  XCircle,
  CheckCircle,
} from "lucide-react";

interface PendingListingCardProps {
  listing: any;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
  isRejecting: boolean;
}

export function PendingListingCard({
  listing,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: PendingListingCardProps) {
  const isGuestListing = listing.is_guest_listing;

  return (
    <Card className="border-l-4 border-l-amber-500">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Lewa kolumna - Informacje */}
          <div className="flex-1 space-y-4">
            {/* Nagłówek */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {listing.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="capitalize">
                    {listing.product_type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800"
                  >
                    🕒 Oczekuje
                  </Badge>
                  {isGuestListing && (
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800"
                    >
                      👤 Gość
                    </Badge>
                  )}
                  {listing.price_type === "rescue" && (
                    <Badge variant="destructive">🚨 Ratunkowe</Badge>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {listing.price_per_unit
                    ? `${listing.price_per_unit} zł/${listing.unit}`
                    : "Za darmo"}
                </p>
                <p className="text-sm text-gray-500">
                  Dodano:{" "}
                  {new Date(listing.created_at).toLocaleDateString("pl-PL")}
                </p>
              </div>
            </div>

            {/* Opis */}
            {listing.description && (
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {listing.description}
              </p>
            )}

            {/* Metadane */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.address}</span>
                </div>

                {listing.available_until && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Ważne do:{" "}
                      {new Date(listing.available_until).toLocaleDateString(
                        "pl-PL"
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {/* Dane użytkownika lub gościa */}
                {isGuestListing ? (
                  <>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{listing.guest_contact_email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{listing.guest_contact_phone}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>
                      {listing.profiles?.full_name ||
                        listing.profiles?.username ||
                        "Użytkownik"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Powód ratunkowy */}
            {listing.rescue_reason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="font-medium text-red-800 mb-1 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Powód akcji ratunkowej:
                </p>
                <p className="text-red-700 text-sm">{listing.rescue_reason}</p>
              </div>
            )}
          </div>

          {/* Prawa kolumna - Akcje */}
          <div className="flex flex-col gap-2 lg:w-48">
            <Button
              onClick={onApprove}
              disabled={isApproving || isRejecting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isApproving ? (
                <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Zatwierdź
            </Button>

            <Button
              onClick={onReject}
              variant="outline"
              disabled={isApproving || isRejecting}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              {isRejecting ? (
                <div className="animate-spin h-4 w-4 border-b-2 border-red-600 rounded-full" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Odrzuć
            </Button>

            <Button
              variant="outline"
              className="mt-2"
              onClick={() => window.open(`/listing/${listing.id}`, "_blank")}
            >
              <Eye className="h-4 w-4 mr-2" />
              Podgląd
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
