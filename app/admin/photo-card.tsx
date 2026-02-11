"use client";

import Image from "next/image";
import { deletePhoto } from "./actions";

interface Photo {
  id: string;
  title: string;
  file_name: string;
  url: string;
  created_at: string;
}

export default function PhotoCard({ photo }: { photo: Photo }) {
  const handleDelete = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    deletePhoto(photo.id);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
      <div className="relative aspect-square">
        <Image
          src={photo.url}
          alt={photo.title || photo.file_name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="p-3">
        <p className="truncate text-sm text-zinc-300">
          {photo.title || photo.file_name}
        </p>
        <p className="text-xs text-zinc-500">
          {new Date(photo.created_at).toLocaleDateString("ko-KR")}
        </p>
      </div>
      <button
        onClick={handleDelete}
        className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-xs text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
      >
        삭제
      </button>
    </div>
  );
}
