// components/ShareButton.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Logo } from "./Logo";
import { Share } from "lucide-react";

interface ShareButtonProps {
  listing: any;
  className?: string;
}

export function ShareButton({ listing, className }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const shareUrl = `${window.location.origin}/listing/${listing.id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("✅ Link skopiowany do schowka!");
    } catch (err) {
      toast.error("❌ Nie udało się skopiować linku");
    }
  };

  const shareOnSocialMedia = (platform: string) => {
    const text = `Sprawdź to ogłoszenie: ${listing.title}`;
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        text + " " + shareUrl
      )}`,
    };

    window.open(
      urls[platform as keyof typeof urls],
      "_blank",
      "width=600,height=400"
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className={className}>
        <Button variant="outline" size="sm">
          <Share /> Udostępnij
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Udostępnij ogłoszenie</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Twitter-like preview */}
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            {listing.images?.[0] && (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
              {listing.description}
            </p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <Logo className="h-6 w-24 text-white" />
              <span>{new URL(shareUrl).hostname}</span>
            </div>
          </div>

          {/* Copy link */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <Button onClick={copyToClipboard}>Kopiuj</Button>
          </div>

          {/* Social media buttons */}
          <div className="flex space-x-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareOnSocialMedia("facebook")}
              className="flex-1"
            >
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareOnSocialMedia("twitter")}
              className="flex-1"
            >
              X
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareOnSocialMedia("whatsapp")}
              className="flex-1"
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
