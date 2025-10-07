// src/components/maps/MobileListingSheet.tsx
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { FarmPopup } from "./FarmPopup";
import { X } from "lucide-react";

interface MobileListingSheetProps {
  listing: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (listing: any) => void;
}

export function MobileListingSheet({
  listing,
  isOpen,
  onClose,
  onSelect,
}: MobileListingSheetProps) {
  // Blokuj scroll body gdy sheet jest otwarty
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Zamknij na escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !listing) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] lg:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center p-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">Szczegóły ogłoszenia</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
          <div className="p-4">
            <FarmPopup listing={listing} onSelect={onSelect} />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
