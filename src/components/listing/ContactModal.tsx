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
  email: string | null;
}

export function ContactModal({
  isOpen,
  onClose,
  listing,
  phoneNumber,
  email,
}: ContactModalProps) {
  const isMobile = window.innerWidth < 1024;

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

  const handleMail = () => {
    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      "Ratuj plon"
    )}&body=${encodeURIComponent("")}`;
    window.location.href = mailto;
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
            <p className="text-sm text-muted-foreground">{listing.title}</p>
          </div>

          <div className="space-y-2">
            {phoneNumber && (
              <div className="flex justify-between items-center p-3 rounded-lg">
                <span>Numer telefonu:</span>
                <span className="font-mono">{phoneNumber}</span>
                <Button variant="ghost" size="sm" onClick={handleCopyNumber}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2">
              {isMobile && (
                <>
                  <Button
                    onClick={handleCall}
                    className="flex items-center gap-2 flex-1"
                  >
                    <Phone className="h-4 w-4" />
                    Zadzwoń
                  </Button>
                  <Button
                    onClick={handleSMS}
                    variant="outline"
                    className="flex items-center gap-2 flex-1"
                  >
                    <MessageCircle className="h-4 w-4" />
                    SMS
                  </Button>
                </>
              )}
              {email && (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 flex-1"
                  onClick={handleMail}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
