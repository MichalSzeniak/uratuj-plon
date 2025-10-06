// src/components/listings/CreateListingModal.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateListingForm } from "./CreateListingForm";

interface CreateListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateListingModal({
  open,
  onOpenChange,
}: CreateListingModalProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dodaj Nowe Ogłoszenie</DialogTitle>
          <DialogDescription>
            Wystaw produkt do sprzedaży lub zgłoś akcję ratunkową
          </DialogDescription>
        </DialogHeader>
        <CreateListingForm
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
