import { CreateListingForm } from "../listings/CreateListingForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <CreateListingForm
          editingListing={listing}
          onSuccess={onClose}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
