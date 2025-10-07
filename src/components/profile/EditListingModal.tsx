import { CreateListingForm } from "../listings/CreateListingForm";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

interface EditListingModalProps {
  listing: any;
  isOpen: boolean;
  onClose: () => void;
}

export function EditListingModal({
  listing,
  isOpen,
  onClose,
}: EditListingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-2">
        <DialogHeader className="text-start">✏️ Edytuj Ogłoszenie</DialogHeader>
        <CreateListingForm
          editingListing={listing}
          onSuccess={onClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
