// src/components/forms/AddFarmForm.tsx
import { useState } from "react";
import { useCreateFarm } from "@/hooks/useFarms";
import type { Location } from "@/types/map";

interface AddFarmFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AddFarmForm({ onSuccess, onCancel }: AddFarmFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    contact_phone: "",
    lat: "",
    lng: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createFarm = useCreateFarm();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Nazwa jest wymagana";
    if (!formData.lat || !formData.lng)
      newErrors.location = "Lokalizacja jest wymagana";
    if (
      formData.lat &&
      (parseFloat(formData.lat) < 49 || parseFloat(formData.lat) > 55)
    ) {
      newErrors.lat = "Nieprawidłowa szerokość geograficzna dla Polski";
    }
    if (
      formData.lng &&
      (parseFloat(formData.lng) < 14 || parseFloat(formData.lng) > 24)
    ) {
      newErrors.lng = "Nieprawidłowa długość geograficzna dla Polski";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const location: Location = {
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
    };

    try {
      await createFarm.mutateAsync({
        name: formData.name,
        description: formData.description || undefined,
        address: formData.address || undefined,
        contact_phone: formData.contact_phone || undefined,
        location,
      });

      setFormData({
        name: "",
        description: "",
        address: "",
        contact_phone: "",
        lat: "",
        lng: "",
      });
      setErrors({});

      onSuccess?.();
    } catch (error) {
      console.error("Error creating farm:", error);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolokalizacja nie jest wspierana przez Twoją przeglądarkę");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        }));
        setErrors((prev) => ({ ...prev, location: "" }));
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Nie udało się pobrać lokalizacji");
      }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Dodaj nowe gospodarstwo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nazwa gospodarstwa */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nazwa gospodarstwa *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="np. Eko Farm Janusza"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Opis */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Opis gospodarstwa
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Opisz swoje gospodarstwo, metody uprawy, wartości..."
          />
        </div>

        {/* Adres */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Adres
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="ul. Przykładowa 123, 00-000 Warszawa"
          />
        </div>

        {/* Telefon kontaktowy */}
        <div>
          <label
            htmlFor="contact_phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Telefon kontaktowy
          </label>
          <input
            type="tel"
            id="contact_phone"
            value={formData.contact_phone}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contact_phone: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="+48 123 456 789"
          />
        </div>

        {/* Lokalizacja */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lokalizacja (współrzędne) *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lat: e.target.value }))
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.lat ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Szerokość (np. 52.2297)"
              />
              {errors.lat && (
                <p className="mt-1 text-sm text-red-600">{errors.lat}</p>
              )}
            </div>
            <div>
              <input
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lng: e.target.value }))
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.lng ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Długość (np. 21.0122)"
              />
              {errors.lng && (
                <p className="mt-1 text-sm text-red-600">{errors.lng}</p>
              )}
            </div>
          </div>
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}

          <button
            type="button"
            onClick={handleCurrentLocation}
            className="mt-2 text-sm text-green-600 hover:text-green-700 flex items-center space-x-1"
          >
            <span>📍</span>
            <span>Użyj mojej aktualnej lokalizacji</span>
          </button>
        </div>

        {/* Przyciski */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={createFarm.isPending}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {createFarm.isPending ? "Dodawanie..." : "Dodaj gospodarstwo"}
          </button>
        </div>
      </form>
    </div>
  );
}
