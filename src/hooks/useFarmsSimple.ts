import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Farm } from "@/types/map";

export function useFarmsSimple() {
  return useQuery({
    queryKey: ["farms-simple"],
    queryFn: async (): Promise<Farm[]> => {
      const { data: farmsData, error: farmsError } = await supabase
        .from("farms")
        .select("*")
        .order("created_at", { ascending: false });

      if (farmsError) {
        throw farmsError;
      }

      if (!farmsData || farmsData.length === 0) {
        return [];
      }

      const farmIds = farmsData.map((farm) => farm.id);
      const { data: listingsData, error: listingsError } = await supabase
        .from("listings")
        .select("*")
        .in("farm_id", farmIds)
        .eq("status", "active");

      if (listingsError) {
        console.error("Listings error:", listingsError);
      }

      const farmerIds = farmsData.map((farm) => farm.farmer_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .in("id", farmerIds);

      if (profilesError) {
        console.error("Profiles error:", profilesError);
      }

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

      return farms;
    },
    staleTime: 5 * 60 * 1000,
  });
}
