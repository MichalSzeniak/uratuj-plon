// src/hooks/useFarms.ts - ROZSZERZONE DEBUGOWANIE
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Farm } from "@/types/map";

// export function useFarms() {
//   const query = useQuery({
//     queryKey: ["farms"],
//     queryFn: async (): Promise<Farm[]> => {
//       console.log("🔄 useFarms - starting fetch...");

//       try {
//         // TEST: Najpierw sprawdźmy proste zapytanie bez joinów
//         const testQuery = await supabase.from("farms").select("*").limit(1);

//         console.log("🧪 Test query result:", testQuery);

//         // Główne zapytanie
//         const { data, error, status } = await supabase
//           .from("farms")
//           .select(
//             `
//             *,
//             profiles:farmer_id (
//               username,
//               full_name,
//               avatar_url
//             ),
//             listings (*)
//           `
//           )
//           .order("created_at", { ascending: false });

//         console.log("📊 Main query - status:", status);
//         console.log("📊 Main query - error:", error);
//         console.log("📊 Main query - data:", data);

//         if (error) {
//           console.error("❌ Error fetching farms:", error);
//           throw error;
//         }

//         // Jeśli brak danych - zwróć pustą tablicę zamiast null
//         const farmsData = data || [];
//         console.log("📦 Raw farms data:", farmsData);

//         // Transformacja danych
//         const farms: Farm[] = farmsData
//           .map((farm) => {
//             let location = { lat: 0, lng: 0 };

//             if (farm.location && farm.location.coordinates) {
//               const [lng, lat] = farm.location.coordinates;
//               location = { lat, lng };
//               console.log(`📍 Farm ${farm.name} coordinates:`, { lat, lng });
//             } else {
//               console.warn(
//                 `❌ Farm ${farm.name} has no coordinates:`,
//                 farm.location
//               );
//             }

//             return {
//               ...farm,
//               location,
//             };
//           })
//           .filter((farm) => farm.location.lat !== 0 && farm.location.lng !== 0);

//         console.log("✅ Transformed farms:", farms);
//         return farms;
//       } catch (error) {
//         console.error("💥 useFarms - caught error:", error);
//         throw error;
//       }
//     },
//     staleTime: 5 * 60 * 1000,
//     retry: 1, // Zmniejsz retry dla szybszego debugowania
//   });

//   // Dodajmy logowanie stanu query
//   console.log("🎯 useFarms query state:", {
//     isLoading: query.isLoading,
//     isFetching: query.isFetching,
//     status: query.status,
//     error: query.error,
//     data: query.data,
//   });

//   return query;
// }

export function useFarms() {
  return useQuery({
    queryKey: ["farms"],
    queryFn: async (): Promise<Farm[]> => {
      console.log("🔄 useFarms - starting fetch...");

      // Dodajmy timeout żeby query się nie zawieszało
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Query timeout after 10s")), 10000);
      });

      const queryPromise = (async () => {
        try {
          const { data, error } = await supabase
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

          if (error) throw error;
          return data || [];
        } catch (error) {
          console.error("Query error:", error);
          throw error;
        }
      })();

      const data = await Promise.race([queryPromise, timeoutPromise]);

      // Transformacja danych
      const farms: Farm[] = data
        .map((farm) => {
          let location = { lat: 0, lng: 0 };

          if (farm.location && farm.location.coordinates) {
            const [lng, lat] = farm.location.coordinates;
            location = { lat, lng };
          }

          return {
            ...farm,
            location,
          };
        })
        .filter((farm) => farm.location.lat !== 0 && farm.location.lng !== 0);

      return farms;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
