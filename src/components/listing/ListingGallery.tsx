// src/components/listing/ListingGallery.tsx
import { useState } from "react";

interface ListingGalleryProps {
  images: string[];
  title: string;
}

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🌱</div>
          <p>Brak zdjęcia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Główne zdjęcie */}
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={images[selectedImage]}
          alt={title}
          className="w-full h-80 object-cover"
        />
      </div>

      {/* Miniaturki */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                selectedImage === index ? "border-green-500" : "border-gray-300"
              }`}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
