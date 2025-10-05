// src/pages/ProfilePage.tsx
import { useAuth } from "@/store/auth";
import { useProfile } from "@/hooks/useProfile";
import { ProfileForm } from "@/components/profile/ProfileForm";

export function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">
            Musisz być zalogowany aby zobaczyć swój profil
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.full_name ||
                user.user_metadata?.full_name ||
                user.email}
            </h1>
            <p className="text-gray-500">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-500">Dołączył:</span>
              <span className="text-sm text-gray-700">
                {new Date(
                  profile?.created_at || user.created_at
                ).toLocaleDateString("pl-PL")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ProfileForm />

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Statystyki</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-green-500">
              Odwiedzonych gospodarstw
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-blue-500">Uratowanych kg</div>
          </div>
        </div>
      </div>
    </div>
  );
}
