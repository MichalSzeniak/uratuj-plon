// src/components/modals/AddFarmModal.tsx
import { AddFarmForm } from "../forms/AddFarmForm";

interface AddFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFarmModal({ isOpen, onClose }: AddFarmModalProps) {
  if (!isOpen) return null;

  const handleSuccess = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <AddFarmForm onSuccess={handleSuccess} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}
