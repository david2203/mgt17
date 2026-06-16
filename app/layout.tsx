import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import "./globals.css";
import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import { getMembers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Mansgruppen",
  description: "Internt verktyg för mansgruppens möten och processer.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = await verifyToken(token);
  let memberName: string | null = null;
  if (session) {
    const members = await getMembers();
    memberName =
      members.find((m) => m.email === session.email)?.name ?? session.email;
  }

  return (
    <html lang="sv">
      <body>
        <a href="#innehall" className="skip-link">
          Hoppa till innehåll
        </a>
        <header className="border-b border-sand-200 bg-sand-100">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="text-lg font-semibold text-clay-700 hover:text-forest-700"
            >
              Mansgruppen
            </Link>
            {session && (
              <nav aria-label="Konto" className="flex items-center gap-4 text-sm">
                {memberName && (
                  <span className="hidden text-clay-400 sm:inline">
                    {memberName}
                  </span>
                )}
                {session.role === "admin" && (
                  <Link href="/admin" className="text-forest-700 hover:underline">
                    Admin
                  </Link>
                )}
                <form action="/api/logout" method="post">
                  <button
                    type="submit"
                    className="text-clay-500 hover:text-clay-700 hover:underline"
                  >
                    Logga ut
                  </button>
                </form>
              </nav>
            )}
          </div>
        </header>
        <main id="innehall" className="mx-auto max-w-3xl px-4 py-6">
          {children}
        </main>
        <footer className="mx-auto max-w-3xl px-4 py-8 text-center text-xs text-clay-400">
          Mansgruppen · internt verktyg
        </footer>
      </body>
    </html>
  );
}
