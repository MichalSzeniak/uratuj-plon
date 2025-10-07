import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-2">
        <DialogHeader className="text-start">
          ➕ Dodaj Nowe Ogłoszenie
        </DialogHeader>
        <CreateListingForm
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
