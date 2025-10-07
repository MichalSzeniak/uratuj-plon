import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, MessageCircle, Phone } from "lucide-react";

interface ListingContactProps {
  listing: any;
}

export function ListingContact({ listing }: ListingContactProps) {
  const handleMail = () => {
    const mailto = `mailto:${
      listing.contact_email
    }?subject=${encodeURIComponent("Ratuj plon")}&body=${encodeURIComponent(
      ""
    )}`;
    window.location.href = mailto;
  };

  const isMobile = window.innerWidth < 1024;

  const phone = listing.contact_phone;

  const handleCall = () => {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  };

  const handleSMS = () => {
    if (!phone) return;
    window.location.href = `sms:${phone}`;
  };

  const handleCopyNumber = async () => {
    if (!phone) return;
    await navigator.clipboard.writeText(phone);
    toast.success("✅ Numer skopiowany do schowka");
  };

  return (
    <Card>
      <CardContent className="p-6 py-0">
        <h3 className="font-semibold mb-4">💬 Skontaktuj się</h3>

        <div className="space-y-3">
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => handleMail()}
          >
            📧 Wyślij wiadomość
          </Button>

          {isMobile && phone && (
            <>
              <Button
                onClick={handleCall}
                className="flex items-center gap-2 w-full"
              >
                <Phone className="h-4 w-4" />
                Zadzwoń
              </Button>

              <Button
                onClick={handleSMS}
                variant="outline"
                className="flex items-center gap-2 w-full"
              >
                <MessageCircle className="h-4 w-4" />
                SMS
              </Button>
            </>
          )}

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span>Numer telefonu:</span>
            <span className="font-mono">{phone}</span>
            <Button variant="ghost" size="sm" onClick={handleCopyNumber}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
