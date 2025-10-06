import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface ImageUploadSimpleProps {
  onImageChange: (file: File | null) => void;
  existingImageUrl?: string | null;
  onExistingImageRemove?: () => void;
}

export function ImageUploadSimple({
  onImageChange,
  existingImageUrl = null,
  onExistingImageRemove,
}: ImageUploadSimpleProps) {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingImageUrl);

  useEffect(() => {
    setPreviewUrl(existingImageUrl);
    if (existingImageUrl && image) {
      setImage(null);
    }
  }, [existingImageUrl]);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Walidacja
    if (!file.type.startsWith("image/")) {
      toast.error("To nie jest plik obrazu");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Plik jest za duży (max 5MB)");
      return;
    }

    // Ustaw nowy plik
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    onImageChange(file);

    // ★ WAŻNE: Jeśli było istniejące zdjęcie, powiadom o usunięciu
    if (existingImageUrl) {
      onExistingImageRemove?.();
    }

    toast.success("Zdjęcie dodane");
  };

  const removeImage = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl); // Zwolnij pamięć tylko dla blob URL
    }

    setImage(null);
    setPreviewUrl(null);
    onImageChange(null);

    // ★ WAŻNE: Jeśli usuwamy istniejące zdjęcie, powiadom parenta
    if (existingImageUrl && previewUrl === existingImageUrl) {
      onExistingImageRemove?.();
    }

    toast.info("Zdjęcie usunięte");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="space-y-4">
      {/* Podgląd zdjęcia */}
      {previewUrl && (
        <Card className="relative max-w-xs">
          <CardContent className="p-4">
            <img
              src={previewUrl}
              alt="Podgląd zdjęcia"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-8 w-8"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="text-xs text-gray-500 mt-2 text-center">
              {image ? "Nowe zdjęcie" : "Aktualne zdjęcie"} • Kliknij X aby
              usunąć
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dropzone - tylko jeśli nie ma zdjęcia */}
      {!previewUrl && (
        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${
                  isDragActive
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300"
                }
              `}
            >
              <input {...getInputProps()} />

              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <div>
                <p className="font-medium">
                  {isDragActive
                    ? "Upuść zdjęcie tutaj"
                    : "Dodaj zdjęcie główne"}
                </p>
                <p className="text-sm text-gray-500">
                  Przeciągnij lub kliknij aby wybrać plik
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Tylko 1 zdjęcie • Do 5MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
