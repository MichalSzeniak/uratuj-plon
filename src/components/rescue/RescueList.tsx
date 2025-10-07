// import { useListings } from "@/hooks/useListings";
// import { RescueListItem } from "./RescueListItem";
// import { useMemo } from "react";
// import { useGeolocation } from "@/hooks/useGeolocation";
// import { Button } from "@/components/ui/button";
// import { MapPin, Navigation } from "lucide-react";
// import { calculateDistance } from "@/lib/distance";

// interface RescueListProps {
//   filters: any;
//   selectedListing: any;
//   onListingSelect: (listing: any) => void;
// }

// export function RescueList({
//   filters,
//   selectedListing,
//   onListingSelect,
// }: RescueListProps) {
//   const { data: listings, isLoading, error } = useListings();
//   const {
//     position: userPosition,
//     loading: positionLoading,
//     error: positionError,
//   } = useGeolocation();

//   const filteredListings = useMemo(() => {
//     if (!listings) return [];

//     let filtered = listings.filter(
//       (listing) =>
//         listing.price_type === "rescue" && listing.status === "active"
//     );

//     if (filters.productType !== "all") {
//       filtered = filtered.filter(
//         (listing) => listing.product_type === filters.productType
//       );
//     }

//     if (filters.urgentOnly) {
//       const now = new Date();
//       const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
//       filtered = filtered.filter(
//         (listing) =>
//           listing.available_until &&
//           new Date(listing.available_until) < tomorrow
//       );
//     }

//     if (userPosition && filters.distance < 100) {
//       filtered = filtered.filter((listing) => {
//         if (!listing.latitude || !listing.longitude) return false;

//         const distance = calculateDistance(
//           userPosition.latitude,
//           userPosition.longitude,
//           listing.latitude,
//           listing.longitude
//         );

//         listing.distance = distance;
//         return distance <= filters.distance;
//       });
//     }

//     // Sortowanie
//     switch (filters.sortBy) {
//       case "newest":
//         filtered.sort(
//           (a, b) =>
//             new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//         );
//         break;
//       case "urgent":
//         filtered.sort((a, b) => {
//           const aUrgent = a.available_until
//             ? new Date(a.available_until).getTime()
//             : Infinity;
//           const bUrgent = b.available_until
//             ? new Date(b.available_until).getTime()
//             : Infinity;
//           return aUrgent - bUrgent;
//         });
//         break;
//       case "distance":
//         if (userPosition) {
//           filtered.sort((a, b) => {
//             const aDistance = a.distance || Infinity;
//             const bDistance = b.distance || Infinity;
//             return aDistance - bDistance;
//           });
//         }
//         break;
//       default:
//         break;
//     }

//     return filtered;
//   }, [listings, filters, userPosition]);

//   // Komponent dla statusu geolokalizacji
//   const renderLocationStatus = () => {
//     if (positionLoading) {
//       return (
//         <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
//           <div className="flex items-center gap-2 text-blue-700">
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//             <span className="text-sm">Pobieranie lokalizacji...</span>
//           </div>
//         </div>
//       );
//     }

//     if (positionError) {
//       return (
//         <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2 text-amber-700">
//               <MapPin className="h-4 w-4" />
//               <span className="text-sm">{positionError}</span>
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => window.location.reload()}
//             >
//               Spróbuj ponownie
//             </Button>
//           </div>
//         </div>
//       );
//     }

//     if (userPosition && filters.distance < 100) {
//       return (
//         <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
//           <div className="flex items-center gap-2 text-green-700">
//             <Navigation className="h-4 w-4" />
//             <span className="text-sm">
//               Pokazuję ogłoszenia w promieniu {filters.distance} km od Twojej
//               lokalizacji
//             </span>
//           </div>
//         </div>
//       );
//     }

//     return null;
//   };

//   if (isLoading) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
//           <p className="text-gray-600">Ładowanie akcji ratunkowych...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="text-center text-red-600">
//           <p>Błąd ładowania akcji ratunkowych</p>
//           <p className="text-sm mt-1">{error.message}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col">
//       {/* Status lokalizacji */}
//       {renderLocationStatus()}

//       {/* Statystyki */}
//       <div className="p-4 border-b bg-gray-50">
//         <div className="flex justify-between items-center text-sm">
//           <span className="font-medium">
//             {filteredListings.length} akcji ratunkowych
//           </span>
//           {userPosition && filters.distance < 100 && (
//             <span className="text-green-600 font-semibold">
//               📍 W promieniu {filters.distance} km
//             </span>
//           )}
//           {filters.urgentOnly && (
//             <span className="text-red-600 font-semibold">🚨 Tylko pilne</span>
//           )}
//         </div>
//       </div>

//       {/* Lista */}
//       <div className="flex-1 overflow-y-auto divide-y">
//         {filteredListings.map((listing) => (
//           <RescueListItem
//             key={listing.id}
//             listing={listing}
//             isSelected={selectedListing?.id === listing.id}
//             onSelect={onListingSelect}
//             // showDistance={!!userPosition}
//           />
//         ))}
//       </div>

//       {/* Brak wyników */}
//       {filteredListings.length === 0 && (
//         <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-500">
//           <div>
//             <div className="text-6xl mb-4">🌱</div>
//             <p className="font-medium">Brak akcji ratunkowych</p>
//             <p className="text-sm mt-1">
//               {filters.urgentOnly
//                 ? "Brak pilnych akcji. Spróbuj wyłączyć filtr 'Tylko pilne'."
//                 : filters.distance < 100
//                 ? "Brak akcji w wybranym promieniu. Spróbuj zwiększyć zakres."
//                 : "Obecnie nie ma żadnych akcji ratunkowych."}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
