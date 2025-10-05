// src/pages/HomePage.tsx
import { useState } from "react";
import { FarmMap } from "@/components/maps/FarmMap";
import type { Farm } from "@/types/map";

export function HomePage() {
  const [showRescueOnly, setShowRescueOnly] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  return (
    <div className="space-y-6">
      {/* Nagłówek i filtry */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {showRescueOnly ? "🚨 Ratuj Plony" : "Znajdź Świeże Plony"}
          </h1>
          <p className="text-lg text-gray-600">
            {showRescueOnly
              ? "Pomóż rolnikom i ratuj żywność przed zmarnowaniem"
              : "Odkryj lokalne gospodarstwa i kupuj prosto od rolnika"}
          </p>
        </div>

        <div className="flex space-x-4">
          {/* Przycisk akcji ratunkowych */}
          <button
            onClick={() => setShowRescueOnly(!showRescueOnly)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              showRescueOnly
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-700 border-gray-300 hover:border-red-500"
            }`}
          >
            <span>🚨</span>
            <span>Akcje Ratunkowe</span>
            {showRescueOnly && (
              <span className="bg-white text-red-500 text-xs px-2 py-1 rounded-full">
                Aktywne
              </span>
            )}
          </button>

          {/* Przycisk dodania gospodarstwa */}
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
            <span>👨‍🌾</span>
            <span>Dodaj Gospodarstwo</span>
          </button>
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-[600px] relative">
          <FarmMap
            showRescueOnly={showRescueOnly}
            onFarmSelect={setSelectedFarm}
          />
        </div>
      </div>

      {/* Informacje o wybranym gospodarstwie */}
      {selectedFarm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedFarm.name}
              </h3>
              <p className="text-gray-600">{selectedFarm.address}</p>
            </div>
            <button
              onClick={() => setSelectedFarm(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          {/* Tutaj można dodać więcej szczegółów o wybranym gospodarstwie */}
        </div>
      )}

      {/* Statystyki i informacje */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">🌱</div>
          <h3 className="font-semibold text-gray-900 mb-1">Świeże Produkty</h3>
          <p className="text-gray-600 text-sm">
            Prosto z pola do Twojego stołu
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">🚨</div>
          <h3 className="font-semibold text-gray-900 mb-1">
            Ratuj Przed Zmarnowaniem
          </h3>
          <p className="text-gray-600 text-sm">Pomóż rolnikom i środowisku</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">🤝</div>
          <h3 className="font-semibold text-gray-900 mb-1">
            Wspieraj Lokalnych
          </h3>
          <p className="text-gray-600 text-sm">
            Kupuj bezpośrednio od rolników
          </p>
        </div>
      </div>
    </div>
  );
}
