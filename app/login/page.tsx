import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  AUTH_COOKIE,
  COOKIE_MAX_AGE,
  createToken,
  roleForPassword,
} from "@/lib/auth";
import { getMembers } from "@/lib/data";

function safeNext(next: string | undefined): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; admin?: string; fel?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const needAdmin = params.admin === "1";
  const error = params.fel;

  async function login(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    const nextPath = safeNext(String(formData.get("next") || "/"));

    const all = await getMembers();
    const member = all.find((m) => m.email.toLowerCase() === email);
    const role = roleForPassword(password);

    if (!member) {
      redirect(`/login?fel=email&next=${encodeURIComponent(nextPath)}`);
    }
    if (!role) {
      redirect(`/login?fel=losen&next=${encodeURIComponent(nextPath)}`);
    }

    const token = await createToken(role!, member!.email);
    (await cookies()).set(AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
    redirect(nextPath);
  }

  return (
    <div className="mx-auto max-w-sm py-8">
      <h1 className="text-2xl font-semibold text-clay-700">Logga in</h1>
      <p className="mt-2 text-clay-500">
        {needAdmin
          ? "Den här sidan kräver adminlösenord. Ange din e-postadress och adminlösenordet."
          : "Ange din e-postadress och lösenordet."}
      </p>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error === "email"
            ? "Okänd e-postadress. Kontrollera att du angett rätt adress."
            : "Fel lösenord. Försök igen."}
        </p>
      )}

      <form action={login} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={next} />
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-clay-600">
            E-postadress
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            autoComplete="email"
            inputMode="email"
            placeholder="din.adress@exempel.se"
            className="mt-1 w-full rounded-md border border-sand-300 bg-white px-3 py-2 text-clay-700 focus:border-forest-600"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-clay-600"
          >
            Lösenord
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-md border border-sand-300 bg-white px-3 py-2 text-clay-700 focus:border-forest-600"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-forest-600 px-4 py-2 font-medium text-white hover:bg-forest-700"
        >
          Logga in
        </button>
      </form>
    </div>
  );
}
