import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { RescueCard } from "./RescueCard";

interface RescueListingsDesktopProps {
  listings: any[];
}

export function RescueListingsDesktop({
  listings,
}: RescueListingsDesktopProps) {
  return (
    <div className="hidden md:block absolute top-4 right-4 z-10">
      <Card className="shadow-lg w-80 max-h-[calc(75vh)] overflow-hidden flex flex-col py-0 pb-3">
        <div className="sticky top-0 bg-white border-b p-3 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="font-semibold text-base">Akcje Ratunkowe</span>
            </div>
            <Badge variant="destructive" className="text-sm px-2 py-1">
              {listings.length}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Pilne ogłoszenia wymagające pomocy
          </p>
        </div>

        <CardContent className="p-0 flex-1 overflow-hidden">
          <div className="p-4 space-y-4 overflow-y-auto max-h-[46vh]">
            {listings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Brak aktualnych akcji ratunkowych</p>
              </div>
            ) : (
              listings.map((listing) => (
                <RescueCard key={listing.id} listing={listing} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
