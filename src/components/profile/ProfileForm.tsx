// src/components/ProfileForm.tsx
import { useState } from "react";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";

export function ProfileForm() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    phone: "",
    role: "" as "farmer" | "customer" | "collector" | undefined,
  });

  useState(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        phone: profile.phone || "",
        role: profile.role,
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile.mutateAsync(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Błąd aktualizacji profilu:", error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        phone: profile.phone || "",
        role: profile.role,
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Profil Użytkownika</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
          >
            Edytuj Profil
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Nazwa użytkownika
            </label>
            <p className="text-gray-900">{profile?.username || "Brak"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Imię i nazwisko
            </label>
            <p className="text-gray-900">{profile?.full_name || "Brak"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Rola</label>
            <p className="text-gray-900 capitalize">
              {profile?.role === "farmer" && "👨‍🌾 Rolnik"}
              {profile?.role === "customer" && "🛒 Klient"}
              {profile?.role === "collector" && "🌱 Zbieracz"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Bio</label>
            <p className="text-gray-900">{profile?.bio || "Brak opisu"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Telefon</label>
            <p className="text-gray-900">{profile?.phone || "Brak"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Edytuj Profil</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Nazwa użytkownika
          </label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-gray-700"
          >
            Imię i nazwisko
          </label>
          <input
            type="text"
            id="full_name"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Rola
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as any })
            }
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="customer">🛒 Klient</option>
            <option value="farmer">👨‍🌾 Rolnik</option>
            <option value="collector">🌱 Zbieracz</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Opis
          </label>
          <textarea
            id="bio"
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Opowiedz coś o sobie..."
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Telefon
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {updateProfile.isPending ? "Zapisywanie..." : "Zapisz zmiany"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
}
