// // src/components/maps/RescueListingsMobile.tsx
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { AlertTriangle, X } from "lucide-react";
// import { RescueCard } from "./RescueCard";

// interface RescueListingsMobileProps {
//   listings: any[];
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export function RescueListingsMobile({
//   listings,
//   isOpen,
//   onOpenChange,
// }: RescueListingsMobileProps) {
//   const handleCardClick = () => {
//     onOpenChange(false);
//   };

//   return (
//     <div className="md:hidden fixed bottom-4 right-4 z-20">
//       <Sheet open={isOpen} onOpenChange={onOpenChange}>
// <SheetTrigger asChild>
//   <Button
//     variant="destructive"
//     size="lg"
//     className="rounded-full w-14 h-14 shadow-lg relative animate-pulse"
//   >
//     <AlertTriangle className="h-5 w-5" />
//     <Badge
//       variant="secondary"
//       className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs min-w-0"
//     >
//       {listings.length}
//     </Badge>
//   </Button>
// </SheetTrigger>
//         <SheetContent side="bottom" className="h-[70vh]">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <AlertTriangle className="h-5 w-5 text-red-500" />
//               <span className="font-semibold text-lg">
//                 Akcje Ratunkowe ({listings.length})
//               </span>
//             </div>
// <Button
//   variant="ghost"
//   size="icon"
//   onClick={() => onOpenChange(false)}
// >
//   <X className="h-4 w-4" />
// </Button>
//           </div>

//           <div className="space-y-3 overflow-y-auto h-full pb-4">
//             {listings.map((listing) => (
//               <RescueCard
//                 key={listing.id}
//                 listing={listing}
//                 onAction={handleCardClick}
//               />
//             ))}
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }

// src/components/maps/RescueListingsMobile.tsx - POPRAWIONY
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlertTriangle, X } from "lucide-react";
import { RescueCard } from "./RescueCard";

interface RescueListingsMobileProps {
  listings: any[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RescueListingsMobile({
  listings,
  isOpen,
  onOpenChange,
}: RescueListingsMobileProps) {
  const handleCardClick = () => {
    onOpenChange(false);
  };

  return (
    <div className="md:hidden fixed bottom-4 right-4 z-20">
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant="destructive"
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg relative"
          >
            <AlertTriangle className="h-5 w-5" />
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs min-w-0"
            >
              {listings.length}
            </Badge>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh] max-h-[90vh] p-0">
          <SheetHeader className="p-4 border-b bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Akcje Ratunkowe
                <Badge variant="destructive" className="ml-2">
                  {listings.length}
                </Badge>
              </SheetTitle>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Lista zajmująca całą dostępną przestrzeń */}
          <div className="h-full overflow-y-auto p-4 ">
            <div className="space-y-4">
              {listings.map((listing) => (
                <RescueCard
                  key={listing.id}
                  listing={listing}
                  onAction={handleCardClick}
                />
              ))}
            </div>

            {/* Informacja na dole */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>🚀 Pomagasz ratować żywność przed zmarnowaniem!</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
