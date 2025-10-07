// hooks/useGeolocation.ts
import { useState, useEffect } from "react";

interface Position {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export function useGeolocation() {
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolokalizacja nie jest wspierana przez przeglądarkę");
      setLoading(false);
      return;
    }

    const success = (pos: GeolocationPosition) => {
      setPosition({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      });
      setLoading(false);
      setError(null);
    };

    const error = (err: GeolocationPositionError) => {
      let message = "Nie udało się pobrać lokalizacji";
      switch (err.code) {
        case err.PERMISSION_DENIED:
          message = "Brak uprawnień do lokalizacji";
          break;
        case err.POSITION_UNAVAILABLE:
          message = "Informacje o lokalizacji niedostępne";
          break;
        case err.TIMEOUT:
          message = "Timeout podczas pobierania lokalizacji";
          break;
      }
      setError(message);
      setLoading(false);
    };

    setLoading(true);
    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    });
  }, []);

  return { position, loading, error };
}
