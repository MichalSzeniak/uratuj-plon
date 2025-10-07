import { useAuth } from "@/store/auth";
import { useProfile } from "@/hooks/useProfile";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { UserListings } from "@/components/profile/UserListings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, List } from "lucide-react";

export function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();

  if (authLoading || profileLoading) {
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
    <div className="max-w-4xl mx-auto space-y-6">
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

      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="listings" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Moje Ogłoszenia
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Edytuj Profil
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          <UserListings />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
