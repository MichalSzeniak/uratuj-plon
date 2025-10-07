// src/components/listing/ListingContact.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ListingContactProps {
  listing: any;
}

export function ListingContact({ listing }: ListingContactProps) {
  const handleContact = (method: string) => {
    toast.info(`Funkcja ${method} wkrótce dostępna!`);
    // Tutaj później dodamy prawdziwą implementację
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">💬 Skontaktuj się</h3>

        <div className="space-y-3">
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => handleContact("wiadomości")}
          >
            📧 Wyślij wiadomość
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleContact("telefonu")}
          >
            📞 Zadzwoń
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleContact("WhatsApp")}
          >
            💚 WhatsApp
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Odpowiedź zazwyczaj w ciągu 24 godzin
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
