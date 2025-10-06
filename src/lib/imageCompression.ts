// src/lib/imageCompression.ts - POPRAWIONA WERSJA
import { IMAGE_CONFIG } from "./imageConfig";

export async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      try {
        // Oblicz nowe wymiary zachowując proporcje
        const maxWidth = IMAGE_CONFIG.dimensions.maxWidth;
        const maxHeight = IMAGE_CONFIG.dimensions.maxHeight;
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Rysuj obrazek na canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Kompresja do WebP z fallback do JPEG
        const mimeType = "image/webp";
        const quality = IMAGE_CONFIG.dimensions.quality;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log("✅ Compression successful:", {
                original: file.size,
                compressed: blob.size,
                reduction: `${((1 - blob.size / file.size) * 100).toFixed(1)}%`,
              });
              resolve(blob);
            } else {
              reject(new Error("Blob creation failed"));
            }
          },
          mimeType,
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Image loading failed"));
    };

    // Użyj createObjectURL zamiast FileReader dla lepszej wydajności
    img.src = URL.createObjectURL(file);
  });
}

export function validateImage(file: File): string | null {
  console.log("🔍 Validating file:", file.name, file.type, file.size);

  if (!IMAGE_CONFIG.acceptedTypes.includes(file.type)) {
    return "Akceptujemy tylko pliki JPG, PNG i WebP";
  }

  if (file.size > IMAGE_CONFIG.maxSize) {
    return `Plik jest za duży. Maksymalny rozmiar: ${
      IMAGE_CONFIG.maxSize / 1024 / 1024
    }MB`;
  }

  if (file.size === 0) {
    return "Plik jest pusty";
  }

  return null;
}

// NOWA FUNKCJA: Prosty compress bez zmiany formatu
export async function simpleCompress(file: File): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      // Zachowaj oryginalne wymiary lub przeskaluj jeśli za duże
      let { width, height } = img;
      const maxDimension = 1200;

      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      // Zachowaj oryginalny format
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type, // Zachowaj oryginalny type
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file); // Fallback do oryginału
          }
        },
        file.type, // Użyj oryginalnego type
        0.8 // Jakość
      );
    };

    img.src = URL.createObjectURL(file);
  });
}
