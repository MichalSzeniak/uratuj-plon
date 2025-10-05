// ALTERNATYWA: src/hooks/useFarmsSimple.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Farm } from "@/types/map";

export function useFarmsSimple() {
  return useQuery({
    queryKey: ["farms-simple"],
    queryFn: async (): Promise<Farm[]> => {
      console.log("🔄 useFarmsSimple - starting...");

      // Krok 1: Pobierz tylko farms
      const { data: farmsData, error: farmsError } = await supabase
        .from("farms")
        .select("*")
        .order("created_at", { ascending: false });

      if (farmsError) {
        console.error("Farms error:", farmsError);
        throw farmsError;
      }

      console.log("🏠 Farms data:", farmsData);

      if (!farmsData || farmsData.length === 0) {
        return [];
      }

      // Krok 2: Pobierz listings osobno
      const farmIds = farmsData.map((farm) => farm.id);
      const { data: listingsData, error: listingsError } = await supabase
        .from("listings")
        .select("*")
        .in("farm_id", farmIds)
        .eq("status", "active");

      if (listingsError) {
        console.error("Listings error:", listingsError);
        // Kontynuuj bez listings zamiast rzucać error
      }

      // Krok 3: Pobierz profile osobno
      const farmerIds = farmsData.map((farm) => farm.farmer_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .in("id", farmerIds);

      if (profilesError) {
        console.error("Profiles error:", profilesError);
        // Kontynuuj bez profiles
      }

      // Krok 4: Połącz dane ręcznie
      const farms: Farm[] = farmsData
        .map((farm) => {
          const farmListings =
            listingsData?.filter((listing) => listing.farm_id === farm.id) ||
            [];
          const farmProfile = profilesData?.find(
            (profile) => profile.id === farm.farmer_id
          );

          let location = { lat: 0, lng: 0 };
          if (farm.location && farm.location.coordinates) {
            const [lng, lat] = farm.location.coordinates;
            location = { lat, lng };
          }

          return {
            ...farm,
            location,
            listings: farmListings,
            profiles: farmProfile,
          };
        })
        .filter((farm) => farm.location.lat !== 0 && farm.location.lng !== 0);

      console.log("✅ Final farms data:", farms);
      return farms;
    },
    staleTime: 5 * 60 * 1000,
  });
}
