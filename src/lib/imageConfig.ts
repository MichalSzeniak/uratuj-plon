export const IMAGE_CONFIG = {
  maxFiles: 5, // Maksymalna liczba zdjęć
  maxSize: 2 * 1024 * 1024, // 2MB per zdjęcie
  acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
  maxTotalSize: 8 * 1024 * 1024, // 8MB łącznie
  dimensions: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8, // Kompresja JPEG/WebP
  },
};
