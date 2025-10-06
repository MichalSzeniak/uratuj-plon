// components/ImageUpload.tsx - UPROSZCZONY DLA JEDNEGO ZDJĘCIA
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IMAGE_CONFIG } from "@/lib/imageConfig";
import { compressImage, validateImage } from "@/lib/imageCompression";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  onExistingImageChange?: (imageUrl: string | null) => void;
  existingImage?: string | null;
}

export function ImageUpload({
  onImageChange,
  onExistingImageChange,
  existingImage = null,
}: ImageUploadProps) {
  const [newFile, setNewFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(
    existingImage
  );
  const [isCompressing, setIsCompressing] = useState(false);

  // Synchronizuj existingImage
  useEffect(() => {
    setCurrentImage(existingImage);
  }, [existingImage]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      // Przyjmij tylko pierwszy plik
      const file = acceptedFiles[0];

      console.log("📸 Processing single image:", file.name);

      setIsCompressing(true);

      try {
        // Walidacja
        const error = validateImage(file);
        if (error) {
          toast.error(error);
          return;
        }

        // Kompresja
        console.log("🔄 Compressing image...");
        const compressedBlob = await compressImage(file);
        const compressedFile = new File(
          [compressedBlob],
          file.name.replace(/\.[^/.]+$/, ".webp"),
          { type: "image/webp" }
        );

        console.log("✅ Compression completed");
        setNewFile(compressedFile);
        onImageChange(compressedFile);

        // Jeśli było stare zdjęcie, wyczyść je
        if (currentImage) {
          setCurrentImage(null);
          onExistingImageChange?.(null);
        }
      } catch (error) {
        console.error("❌ Compression error:", error);
        // Fallback do oryginału
        setNewFile(file);
        onImageChange(file);

        if (currentImage) {
          setCurrentImage(null);
          onExistingImageChange?.(null);
        }
      } finally {
        setIsCompressing(false);
      }
    },
    [currentImage, onImageChange, onExistingImageChange]
  );

  const removeNewFile = () => {
    console.log("🗑️ Removing new file");
    setNewFile(null);
    onImageChange(null);

    // ★ WAŻNE: Jeśli usuwamy nowy plik, przywróć istniejące zdjęcie
    if (currentImage) {
      onExistingImageChange?.(currentImage);
    }
  };

  const removeExistingImage = () => {
    console.log("🗑️ Removing existing image:", currentImage);

    if (confirm("Czy na pewno chcesz usunąć to zdjęcie?")) {
      setCurrentImage(null);
      onExistingImageChange?.(null);

      // ★ WAŻNE: Jeśli usuwamy istniejące zdjęcie, wyczyść też newFile
      if (newFile) {
        setNewFile(null);
        onImageChange(null);
      }

      toast.success("Zdjęcie zostało usunięte");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: IMAGE_CONFIG.maxSize,
    maxFiles: 1,
    multiple: false,
    disabled: isCompressing || !!newFile,
  });

  const hasImage = !!currentImage || !!newFile;

  return (
    <div className="space-y-4">
      {/* Aktualne zdjęcie */}
      {currentImage && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Aktualne zdjęcie
          </h4>
          <Card className="relative group max-w-xs">
            <CardContent className="p-4">
              <img
                src={currentImage}
                alt="Aktualne zdjęcie ogłoszenia"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={removeExistingImage}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="text-xs text-gray-500 mt-2 text-center">
                Kliknij X aby usunąć
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Nowe zdjęcie */}
      {newFile && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Nowe zdjęcie
          </h4>
          <Card className="relative group max-w-xs">
            <CardContent className="p-4">
              <img
                src={URL.createObjectURL(newFile)}
                alt="Podgląd nowego zdjęcia"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={removeNewFile}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="text-xs text-gray-500 mt-2 text-center">
                {(newFile.size / 1024).toFixed(0)}KB • Kliknij X aby usunąć
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dropzone - tylko jeśli nie ma zdjęcia */}
      {!hasImage && (
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
                ${isCompressing ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <input {...getInputProps()} />

              {isCompressing ? (
                <div className="space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-sm text-gray-600">
                    Kompresowanie zdjęcia...
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
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
                      Tylko 1 zdjęcie • Do {IMAGE_CONFIG.maxSize / 1024 / 1024}
                      MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informacja o limicie */}
      {hasImage && (
        <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            Masz już dodane zdjęcie. Usuń obecne aby dodać nowe.
          </p>
        </div>
      )}
    </div>
  );
}
