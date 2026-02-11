"use client";

import { useState, useRef } from "react";
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
  const frameRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState({ visible: false, x: 0, y: 0 });

  if (photos.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-zinc-400">No photos yet.</p>
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursor({ visible: true, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Hero photo */}
      <div
          ref={frameRef}
          className="relative flex-1 min-h-0 cursor-none"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setCursor((c) => ({ ...c, visible: true }))}
          onMouseLeave={() => setCursor((c) => ({ ...c, visible: false }))}
        >
          <Image
            src={selected.url}
            alt={selected.title || selected.file_name}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />

          {/* Previous */}
          {selectedIndex > 0 && (
            <button
              onClick={() => setSelectedIndex(selectedIndex - 1)}
              className="absolute left-0 top-0 h-full w-1/2 cursor-none"
            />
          )}

          {/* Next */}
          {selectedIndex < photos.length - 1 && (
            <button
              onClick={() => setSelectedIndex(selectedIndex + 1)}
              className="absolute right-0 top-0 h-full w-1/2 cursor-none"
            />
          )}

          {/* Custom cursor */}
          {cursor.visible && (
            <span
              className="pointer-events-none absolute z-10 text-xs font-medium text-zinc-500"
              style={{ left: cursor.x + 12, top: cursor.y + 12 }}
            >
              {selectedIndex + 1}/{photos.length}
            </span>
          )}
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
