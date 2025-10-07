// src/components/rescue/RescueFilters.tsx
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface RescueFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export function RescueFilters({
  filters,
  onFiltersChange,
}: RescueFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const productTypes = [
    { value: "all", label: "Wszystkie produkty" },
    { value: "vegetables", label: "🥦 Warzywa" },
    { value: "fruits", label: "🍎 Owoce" },
    { value: "grains", label: "🌾 Zboża" },
    { value: "honey", label: "🍯 Miód" },
    { value: "eggs", label: "🥚 Jaja" },
    { value: "dairy", label: "🧀 Nabiał" },
    { value: "meat", label: "🥩 Mięso" },
    { value: "preserves", label: "🥫 Przetwory" },
  ];

  const handleClearFilters = () => {
    onFiltersChange({
      productType: "all",
      distance: 50,
      sortBy: "newest",
      urgentOnly: false,
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Główne filtry */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Typ produktu</label>
          <Select
            value={filters.productType}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, productType: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {productTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Sortowanie</label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, sortBy: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Najnowsze</SelectItem>
              <SelectItem value="urgent">Pilne pierwsze</SelectItem>
              <SelectItem value="distance">Najbliższe</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Zaawansowane filtry */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="p-0 h-auto text-sm text-gray-600 hover:text-gray-900"
        >
          {showAdvanced ? "▲" : "▼"} Filtry zaawansowane
        </Button>

        {showAdvanced && (
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            {/* Tylko pilne */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={filters.urgentOnly}
                  onCheckedChange={(checked) =>
                    onFiltersChange({ ...filters, urgentOnly: checked })
                  }
                />
                <label className="text-sm font-medium">
                  Tylko pilne (do 24h)
                </label>
              </div>
            </div>

            {/* Zakres odległości */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Zakres odległości</span>
                <span>do {filters.distance} km</span>
              </div>
              <Slider
                value={[filters.distance]}
                onValueChange={([value]) =>
                  onFiltersChange({ ...filters, distance: value })
                }
                max={100}
                step={10}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Przyciski akcji */}
      <div className="flex justify-between pt-2 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          disabled={
            filters.productType === "all" &&
            filters.sortBy === "newest" &&
            !filters.urgentOnly &&
            filters.distance === 50
          }
        >
          Wyczyść filtry
        </Button>

        <div className="text-xs text-gray-500">
          {filters.urgentOnly && "🚨 "}
          Filtry aktywne
        </div>
      </div>
    </div>
  );
}
