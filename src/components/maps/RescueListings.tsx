import { useState } from "react";
import { EmptyRescueState } from "./EmptyRescueState";
import { RescueListingsDesktop } from "./RescueListingsDesktop";
import { RescueListingsMobile } from "./RescueListingsMobile";

interface RescueListingsProps {
  listings: any[];
}

export function RescueListings({ listings }: RescueListingsProps) {
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const rescueListings = listings.filter(
    (listing) => listing.price_type === "rescue" && listing.status === "active"
  );

  if (rescueListings.length === 0) {
    return <EmptyRescueState />;
  }

  return (
    <>
      <RescueListingsDesktop listings={rescueListings} />

      <RescueListingsMobile
        listings={rescueListings}
        isOpen={mobileSheetOpen}
        onOpenChange={setMobileSheetOpen}
      />
    </>
  );
}
