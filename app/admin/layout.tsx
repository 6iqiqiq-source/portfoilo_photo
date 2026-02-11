import { logoutAction } from "@/app/admin/actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <h1 className="text-lg font-semibold">Photo Admin</h1>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            로그아웃
          </button>
        </form>
      </nav>
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  );
}
