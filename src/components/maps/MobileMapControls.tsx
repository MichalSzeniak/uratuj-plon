import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Phone, X } from "lucide-react";
import { toast } from "sonner";
import { ContactModal } from "../listing/ContactModal";
import { useState } from "react";

interface MobileMapControlsProps {
  selectedListing: any | null;
  onShowDetails: () => void;
  onNavigate: () => void;
  onCall: () => void;
  onClose: () => void;
}

export function MobileMapControls({
  selectedListing,
  onShowDetails,
  onNavigate,
  onCall,
  onClose,
}: MobileMapControlsProps) {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  // console.log(selectedListing);
  // const handleCall = () => {
  //   const phoneNumber = "+48123456789";

  //   const isMobileDevice =
  //     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  //       navigator.userAgent
  //     );

  //   if (isMobileDevice) {
  //     window.location.href = `tel:${phoneNumber}`;
  //   } else {
  //     toast.info(`📞 Numer telefonu: ${phoneNumber}`, {
  //       action: {
  //         label: "Kopiuj",
  //         onClick: () => navigator.clipboard.writeText(phoneNumber),
  //       },
  //     });
  //   }
  // };

  if (!selectedListing) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9] lg:hidden animate-in slide-in-from-bottom duration-300">
      <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 mr-2">
            <h3 className="font-semibold text-sm truncate">
              {selectedListing.title}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {selectedListing.user?.full_name ||
                selectedListing.user?.username ||
                "Anonim"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
              {selectedListing.price_per_unit
                ? `${selectedListing.price_per_unit} zł/${selectedListing.unit}`
                : "Za darmo"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-1 w-1" />
            </Button>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs text-gray-600 line-clamp-2">
            {selectedListing.description || "Brak opisu"}
          </p>
          {selectedListing.address && (
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              📍 {selectedListing.address}
            </p>
          )}
        </div>

        <div className="flex justify-between gap-1">
          <Button
            onClick={onShowDetails}
            className="flex-1 bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <MapPin className="h-1 w-1 mr-0" />
            Szczegóły
          </Button>

          <Button
            onClick={onNavigate}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Navigation className="h-1 w-1 mr-0" />
            Nawiguj
          </Button>

          <Button
            disabled={!selectedListing.contact_phone}
            onClick={() => setContactModalOpen(true)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Phone className="h-1 w-1 mr-0" />
            Kontakt
          </Button>
          <ContactModal
            isOpen={contactModalOpen}
            onClose={setContactModalOpen}
            listing={selectedListing}
            phoneNumber={selectedListing.contact_phone}
          />
        </div>

        {selectedListing.price_type === "rescue" && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
            <p className="text-xs text-red-700 font-medium text-center">
              🚨 Akcja Ratunkowa
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
