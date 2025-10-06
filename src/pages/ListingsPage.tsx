// src/pages/ListingsPage.tsx
import { useState } from "react";
import { FarmMap } from "@/components/maps/FarmMap";
import { ListingsList } from "@/components/listings/ListingsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, List } from "lucide-react";

export function ListingsPage() {
  const [selectedFarm, setSelectedFarm] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ogłoszenia Gospodarstw
        </h1>
        <p className="text-lg text-gray-600">
          Znajdź świeże produkty prosto od rolników
        </p>
      </div>

      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Mapa
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Lista
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-[600px] relative">
              <FarmMap onFarmSelect={setSelectedFarm} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list">
          <ListingsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
