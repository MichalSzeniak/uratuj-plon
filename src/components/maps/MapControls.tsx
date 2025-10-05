import type { MapViewport } from "@/types/map";

interface MapControlsProps {
  viewport: MapViewport;
  onViewportChange: (viewport: MapViewport) => void;
  farmCount: number;
}

export function MapControls({
  viewport,
  onViewportChange,
  farmCount,
}: MapControlsProps) {
  const quickLocations = [
    {
      name: "Warszawa",
      center: [52.2297, 21.0122] as [number, number],
      zoom: 10,
    },
    { name: "Kraków", center: [50.0647, 19.945] as [number, number], zoom: 10 },
    {
      name: "Wrocław",
      center: [51.1079, 17.0385] as [number, number],
      zoom: 10,
    },
    {
      name: "Poznań",
      center: [52.4064, 16.9252] as [number, number],
      zoom: 10,
    },
    { name: "Cała Polska", center: [52.0, 19.0] as [number, number], zoom: 6 },
  ];

  const handleLocationClick = (center: [number, number], zoom: number) => {
    onViewportChange({ center, zoom });
  };

  return (
    <div className="absolute top-4 left-4 z-10 space-y-3">
      {/* Szybka nawigacja */}
      <div className="bg-white rounded-lg shadow-lg p-4 space-y-2 min-w-[200px]">
        <h3 className="font-semibold text-gray-900 text-sm">
          Szybka nawigacja
        </h3>
        <div className="space-y-1">
          {quickLocations.map((location) => (
            <button
              key={location.name}
              onClick={() =>
                handleLocationClick(location.center, location.zoom)
              }
              className="w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              📍 {location.name}
            </button>
          ))}
        </div>
      </div>

      {/* Statystyki */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{farmCount}</div>
          <div className="text-xs text-gray-600">aktywnych gospodarstw</div>
        </div>
      </div>

      {/* Legenda */}
      <div className="bg-white rounded-lg shadow-lg p-4 space-y-2">
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
      </div>
    </div>
  );
}
