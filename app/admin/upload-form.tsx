"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { savePhotoRecord } from "./actions";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UploadForm() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file") as File;
    const title = (formData.get("title") as string) || "";

    if (!file || file.size === 0) {
      setMessage({ type: "error", text: "파일을 선택해주세요." });
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "이미지 파일만 업로드할 수 있습니다." });
      return;
    }

    setPending(true);
    setMessage(null);

    const fileName = `${Date.now()}_${file.name}`;
    const storagePath = `photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(storagePath, file, { contentType: file.type });

    if (uploadError) {
      setMessage({ type: "error", text: `업로드 실패: ${uploadError.message}` });
      setPending(false);
      return;
    }

    const result = await savePhotoRecord({
      title,
      fileName: file.name,
      storagePath,
    });

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "업로드 완료!" });
      form.reset();
    }

    setPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <div>
        <label className="mb-1 block text-sm text-zinc-400">사진 파일</label>
        <input
          type="file"
          name="file"
          accept="image/*"
          required
          className="w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:text-white file:transition-colors hover:file:bg-zinc-700"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-zinc-400">제목 (선택)</label>
        <input
          type="text"
          name="title"
          placeholder="사진 제목"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-white px-6 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "업로드 중..." : "업로드"}
      </button>
      {message?.type === "error" && <p className="text-sm text-red-400">{message.text}</p>}
      {message?.type === "success" && <p className="text-sm text-green-400">{message.text}</p>}
    </form>
  );
}
