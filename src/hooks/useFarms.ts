import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Farm } from "@/types/map";

export function useFarms() {
  const query = useQuery({
    queryKey: ["farms"],
    queryFn: async (): Promise<Farm[]> => {
      try {
        const { data, error, status } = await supabase
          .from("farms")
          .select(
            `
            *,
            profiles:farmer_id (
              username,
              full_name,
              avatar_url
            ),
            listings (*)
          `
          )
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        const farmsData = data || [];

        const farms: Farm[] = farmsData
          .map((farm) => {
            let location = { lat: 0, lng: 0 };

            if (farm.location && farm.location.coordinates) {
              const [lng, lat] = farm.location.coordinates;
              location = { lat, lng };
            } else {
              console.warn(
                `❌ Farm ${farm.name} has no coordinates:`,
                farm.location
              );
            }

            return {
              ...farm,
              location,
            };
          })
          .filter((farm) => farm.location.lat !== 0 && farm.location.lng !== 0);

        return farms;
      } catch (error) {
        console.error("💥 useFarms - caught error:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return query;
}
