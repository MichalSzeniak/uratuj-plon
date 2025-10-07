// components/ContactModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Mail, Copy } from "lucide-react";
import { toast } from "sonner";
import type { Dispatch, SetStateAction } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  listing: any;
  phoneNumber: string | null;
}

export function ContactModal({
  isOpen,
  onClose,
  listing,
  phoneNumber,
}: ContactModalProps) {
  const handleCall = () => {
    if (!phoneNumber) return;
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleSMS = () => {
    if (!phoneNumber) return;
    window.location.href = `sms:${phoneNumber}`;
  };

  const handleCopyNumber = async () => {
    if (!phoneNumber) return;
    await navigator.clipboard.writeText(phoneNumber);
    toast.success("✅ Numer skopiowany do schowka");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Skontaktuj się</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center">
            <p className="font-semibold">{listing.user?.full_name}</p>
            <p className="text-sm text-gray-600">{listing.title}</p>
          </div>

          {phoneNumber ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-mono">{phoneNumber}</span>
                <Button variant="ghost" size="sm" onClick={handleCopyNumber}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleCall}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Zadzwoń
                </Button>
                <Button
                  onClick={handleSMS}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  SMS
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">Numer telefonu niedostępny</p>
              <Button variant="outline" className="mt-2">
                <Mail className="h-4 w-4 mr-2" />
                Wyślij wiadomość
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
