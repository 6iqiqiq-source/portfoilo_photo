"use client";

import { useActionState } from "react";
import { uploadPhoto } from "./actions";

export default function UploadForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => {
      const result = await uploadPhoto(formData);
      return result;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
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
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-400">업로드 완료!</p>}
    </form>
  );
}
