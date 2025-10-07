import { useState } from "react";
import { EmptyRescueState } from "./EmptyRescueState";
import { RescueListingsDesktop } from "./RescueListingsDesktop";
import { RescueListingsMobile } from "./RescueListingsMobile";

interface RescueListingsProps {
  listings: any[];
}

export function RescueListings({ listings }: RescueListingsProps) {
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Filtruj tylko akcje ratunkowe
  const rescueListings = listings.filter(
    (listing) => listing.price_type === "rescue" && listing.status === "active"
  );

  console.log("🔍 RescueListings debug:", {
    totalListings: listings.length,
    rescueListings: rescueListings.length,
    listings: rescueListings.map((l) => ({
      title: l.title,
      address: l.address,
    })),
  });

  // Brak akcji ratunkowych
  if (rescueListings.length === 0) {
    return <EmptyRescueState />;
  }

  return (
    <>
      {/* Desktop */}
      <RescueListingsDesktop listings={rescueListings} />

      {/* Mobile */}
      <RescueListingsMobile
        listings={rescueListings}
        isOpen={mobileSheetOpen}
        onOpenChange={setMobileSheetOpen}
      />
    </>
  );
}
