// src/components/maps/MapControls.tsx - UPROSZCZONA WERSJA
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Filter } from "lucide-react";
import { useState } from "react";
import { markerColors } from "./CustomMarkers";

interface MapControlsProps {
  farmCount: number;
  showRescueOnly?: boolean;
  onToggleRescue?: () => void;
}

export function MapControls({
  farmCount,
  showRescueOnly = false,
  onToggleRescue,
}: MapControlsProps) {
  const [showLegend, setShowLegend] = useState(false);

  // Desktop controls
  const DesktopControls = () => (
    <div className="hidden md:flex flex-col gap-3">
      {/* Statystyki */}
      <Card className="shadow-lg">
        <CardContent className="p-3">
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{farmCount}</div>
            <div className="text-xs text-gray-600">
              {showRescueOnly ? "akcji ratunkowych" : "gospodarstw"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Przycisk legendy */}
      <Card className="shadow-lg">
        <CardContent className="p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLegend(!showLegend)}
            className="w-full h-8 text-xs"
          >
            <Info className="h-3 w-3 mr-1" />
            Legenda
          </Button>
        </CardContent>
      </Card>

      {/* Przycisk akcji ratunkowych */}
      {onToggleRescue && (
        <Card className="shadow-lg">
          <CardContent className="p-2">
            <Button
              variant={showRescueOnly ? "destructive" : "outline"}
              onClick={onToggleRescue}
              className="w-full text-xs h-8"
              size="sm"
            >
              <Filter className="h-3 w-3 mr-1" />
              {showRescueOnly ? "Wszystkie" : "Ratunkowe"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Legenda - pokazywana warunkowo */}
      {showLegend && (
        <Card className="shadow-lg animate-in fade-in">
          <CardContent className="p-3 space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm">Legenda</h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Gospodarstwo</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Akcja ratunkowa</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Zbiór samodzielny</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Mobile controls - tylko statystyki i przyciski
  const MobileControls = () => (
    <div className="md:hidden flex gap-2">
      {/* Statystyki */}
      <Card className="shadow-lg">
        <CardContent className="p-2">
          <div className="text-center">
            <div className="text-sm font-bold text-green-600">{farmCount}</div>
            <div className="text-[10px] text-gray-600">
              {showRescueOnly ? "ratunk." : "gosp."}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Przycisk legendy */}
      <Card className="shadow-lg">
        <CardContent className="p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLegend(!showLegend)}
            className="h-8 w-8"
          >
            <Info className="h-3 w-3" />
          </Button>
        </CardContent>
      </Card>

      {/* Przycisk akcji ratunkowych */}
      {onToggleRescue && (
        <Card className="shadow-lg">
          <CardContent className="p-1">
            <Button
              variant={showRescueOnly ? "destructive" : "outline"}
              size="icon"
              onClick={onToggleRescue}
              className="h-8 w-8"
            >
              <Filter className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Legenda dla mobile - jako popover/tooltip */}
      {showLegend && (
        <Card className="shadow-lg animate-in fade-in">
          <CardContent className="p-3 space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm">Legenda</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: markerColors.normal }}
                ></div>
                <span className="text-gray-600">Gospodarstwo</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: markerColors.rescue }}
                ></div>
                <span className="text-gray-600">Akcja ratunkowa</span>
                <span className="text-red-500 text-xs">🚨</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: markerColors.pickup }}
                ></div>
                <span className="text-gray-600">Zbiór samodzielny</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="absolute bottom-4 left-2 z-10">
      <DesktopControls />
      <MobileControls />
    </div>
  );
}
