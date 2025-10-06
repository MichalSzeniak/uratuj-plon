// Nowy komponent - src/components/maps/ReliableTileLayer.tsx
import { useState } from "react";
import { TileLayer } from "react-leaflet";

const TILE_SERVERS = [
  //   {
  //     name: "GIS Support PL",
  //     url: "https://mapserver.gis-support.pl/tiles/tiles/{z}/{x}/{y}.png",
  //     attribution:
  //       '&copy; <a href="https://gis-support.pl">GIS Support</a> & <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  //   },

  //   {
  //     name: "GIS Support PL",
  //     url: "https://{s}.tile.openstreetmap.pl/osm-pl/{z}/{x}/{y}.png",
  //     attribution:
  //       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Tiles: <a href="https://openstreetmap.pl">OSM PL</a>',
  //   },

  {
    name: "Standard OSM",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    name: "OSM France",
    url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
    attribution:
      '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
];

export function ReliableTileLayer() {
  const [currentServerIndex, setCurrentServerIndex] = useState(0);

  const handleTileError = () => {
    console.warn(
      `Serwer ${TILE_SERVERS[currentServerIndex].name} nie działa, próbuję następny...`
    );
    if (currentServerIndex < TILE_SERVERS.length - 1) {
      setCurrentServerIndex((prev) => prev + 1);
    }
  };

  return (
    <TileLayer
      key={currentServerIndex} // Wymusza re-render przy zmianie
      url={TILE_SERVERS[currentServerIndex].url}
      attribution={TILE_SERVERS[currentServerIndex].attribution}
      eventHandlers={{
        tileerror: handleTileError,
      }}
    />
  );
}
