"use client";

import { useState } from "react";
import Image from "next/image";

interface Photo {
  id: string;
  title: string;
  file_name: string;
  url: string;
}

export default function Portfolio({ photos }: { photos: Photo[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = photos[selectedIndex];

  if (photos.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-zinc-400">No photos yet.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Hero photo */}
      <div className="relative flex-1 min-h-0">
        <Image
          src={selected.url}
          alt={selected.title || selected.file_name}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>

      {/* Thumbnail gallery */}
      <div className="shrink-0 border-t border-zinc-100 bg-white px-6 py-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded transition-opacity ${
                index === selectedIndex
                  ? "opacity-100 ring-2 ring-black"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={photo.url}
                alt={photo.title || photo.file_name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
