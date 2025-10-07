// // components/admin/PendingListings.tsx
// export function PendingListings() {
//   const { data: pendingListings } = useQuery({
//     queryKey: ["listings", "pending"],
//     queryFn: async () => {
//       const { data } = await supabase
//         .from("listings")
//         .select("*")
//         .eq("status", "pending")
//         .order("created_at", { ascending: true });
//       return data;
//     },
//   });

//   const approveListing = async (listingId: string) => {
//     await supabase
//       .from("listings")
//       .update({ status: "active", approved_by_admin: true })
//       .eq("id", listingId);
//   };

//   const rejectListing = async (listingId: string) => {
//     await supabase
//       .from("listings")
//       .update({ status: "rejected" })
//       .eq("id", listingId);
//   };

//   return (
//     <div className="space-y-4">
//       <h2 className="text-2xl font-bold">Ogłoszenia do zatwierdzenia</h2>
//       {pendingListings?.map((listing) => (
//         <PendingListingCard
//           key={listing.id}
//           listing={listing}
//           onApprove={approveListing}
//           onReject={rejectListing}
//         />
//       ))}
//     </div>
//   );
// }
