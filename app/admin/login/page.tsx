"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <form action={formAction} className="w-full max-w-sm space-y-4 p-8">
        <h1 className="text-xl font-semibold text-white">Admin Login</h1>
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-white px-4 py-3 font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "로그인 중..." : "로그인"}
        </button>
        {state?.error && (
          <p className="text-sm text-red-400">{state.error}</p>
        )}
      </form>
    </div>
  );
}
