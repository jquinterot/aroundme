'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PlaceGalleryProps {
  images: string[];
  placeName: string;
}

export function PlaceGallery({ images, placeName }: PlaceGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const goPrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2 h-64">
        {images.slice(0, 4).map((image, index) => (
          <button
            key={index}
            onClick={() => openLightbox(index)}
            className={`relative overflow-hidden rounded-xl ${
              index === 0 ? 'col-span-2 row-span-2' : ''
            }`}
          >
            <Image
              src={image}
              alt={`${placeName} - Image ${index + 1}`}
              fill
              sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 25vw, 12.5vw"}
              className="object-cover hover:opacity-90 transition-opacity"
            />
            {index === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">+{images.length - 4}</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={goPrev}
            className="absolute left-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goNext}
            className="absolute right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative w-full h-full max-w-4xl max-h-[80vh] mx-4">
            <Image
              src={images[selectedIndex]}
              alt={`${placeName} - Image ${selectedIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === selectedIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>

          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {selectedIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
