// src/components/listing/ListingActions.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ListingActionsProps {
  listing: any;
}

export function ListingActions({ listing }: ListingActionsProps) {
  const handleSave = () => {
    toast.success("✅ Oferta zapisana w ulubionych!");
  };

  const handleReport = () => {
    toast.info("🚨 Zgłoszenie - wkrótce dostępne");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-3">
          <Button variant="outline" className="w-full" onClick={handleSave}>
            💾 Zapisz ofertę
          </Button>

          <Button
            variant="outline"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleReport}
          >
            🚨 Zgłoś ofertę
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
