// src/components/maps/EmptyRescueState.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function EmptyRescueState() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block absolute top-4 right-4 z-10">
        <Card className="shadow-lg max-w-xs">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-500">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Brak akcji ratunkowych</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile */}
      <div className="md:hidden fixed bottom-4 right-4 z-20">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 shadow-lg"
          disabled
        >
          <AlertTriangle className="h-5 w-5 text-gray-400" />
        </Button>
      </div>
    </>
  );
}
