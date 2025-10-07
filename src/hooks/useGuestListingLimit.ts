import { useState, useEffect } from "react";

interface GuestListingLimits {
  canCreateListing: boolean;
  remainingListings: number;
  timeUntilReset: string;
}

export function useGuestListingLimit(): GuestListingLimits {
  const [limits, setLimits] = useState<GuestListingLimits>({
    canCreateListing: true,
    remainingListings: 3,
    timeUntilReset: "",
  });

  useEffect(() => {
    const checkLimits = () => {
      const today = new Date().toDateString();
      const stored = localStorage.getItem(`guest_listings_${today}`);
      const guestListingsToday = parseInt(stored || "0");

      const canCreate = guestListingsToday < 3;
      const remaining = Math.max(0, 3 - guestListingsToday);

      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const timeUntilReset = Math.max(0, tomorrow.getTime() - now.getTime());
      const hours = Math.floor(timeUntilReset / (1000 * 60 * 60));
      const minutes = Math.floor(
        (timeUntilReset % (1000 * 60 * 60)) / (1000 * 60)
      );

      setLimits({
        canCreateListing: canCreate,
        remainingListings: remaining,
        timeUntilReset: `${hours}h ${minutes}m`,
      });
    };

    checkLimits();
    const interval = setInterval(checkLimits, 60000); // Update co minutę

    return () => clearInterval(interval);
  }, []);

  const incrementGuestListing = () => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(`guest_listings_${today}`);
    const current = parseInt(stored || "0");
    localStorage.setItem(`guest_listings_${today}`, (current + 1).toString());
  };

  return { ...limits, incrementGuestListing };
}
