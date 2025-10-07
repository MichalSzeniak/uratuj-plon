import { useState } from "react";
import { FarmMap } from "@/components/maps/FarmMap";
import { RescueList } from "./RescueList";
import { RescueFilters } from "./RescueFilters";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function RescueView() {
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [filters, setFilters] = useState({
    productType: "all",
    distance: 25,
    sortBy: "newest",
    urgentOnly: false,
  });

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-red-50 border-b border-red-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-red-800 flex items-center gap-2">
                🚨 Akcje Ratunkowe
              </h1>
              <p className="text-red-600">
                Pomóż rolnikom i ratuj żywność przed zmarnowaniem
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline" size="sm">
                  ← Powrót
                </Button>
              </Link>
              <Link to="/create-listing">
                <Button className="bg-red-600 hover:bg-red-700" size="sm">
                  + Dodaj akcję
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filtry */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto">
          <RescueFilters filters={filters} onFiltersChange={setFilters} />
        </div>
      </div>

      {/* Główna zawartość */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Lista ogłoszeń */}
        <div className="lg:w-96 border-r bg-white overflow-y-auto flex flex-col">
          <RescueList
            filters={filters}
            selectedListing={selectedListing}
            onListingSelect={setSelectedListing}
          />
        </div>

        {/* Mapa */}
        <div className="flex-1 min-h-[400px] lg:min-h-0">
          <FarmMap showRescueOnly={true} onFarmSelect={setSelectedListing} />
        </div>
      </div>
    </div>
  );
}
