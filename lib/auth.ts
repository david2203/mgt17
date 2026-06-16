// Edge- och Node-kompatibel auth med Web Crypto (HMAC-SHA256).
// Inloggning: välj din e-post (medlem) + delat lösenord.
//   SITE_PASSWORD  -> medlem
//   ADMIN_PASSWORD -> admin (även medlemsbehörighet)

export type Role = "member" | "admin";

export type Session = {
  role: Role;
  email: string;
};

export const AUTH_COOKIE = "mansgrupp_auth";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 dagar

function secret(): string {
  return process.env.AUTH_SECRET || "osaker-standardnyckel-byt-mig";
}

function toBase64url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(str: string): string {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  return atob(str.replace(/-/g, "+").replace(/_/g, "/") + pad);
}

async function hmac(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  const bytes = new Uint8Array(sig);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return toBase64url(bin);
}

// Token-format: "<payloadB64url>.<signatur>"
export async function createToken(role: Role, email: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = toBase64url(JSON.stringify({ role, email, exp }));
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function verifyToken(
  token: string | undefined,
): Promise<Session | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expected = await hmac(payload);
  if (sig !== expected) return null;
  try {
    const data = JSON.parse(fromBase64url(payload)) as {
      role?: string;
      email?: string;
      exp?: number;
    };
    if (data.role !== "member" && data.role !== "admin") return null;
    if (typeof data.email !== "string" || !data.email) return null;
    if (!data.exp || data.exp * 1000 < Date.now()) return null;
    return { role: data.role, email: data.email };
  } catch {
    return null;
  }
}

// Avgör roll utifrån angivet lösenord. Admin-lösenordet ger full behörighet.
export function roleForPassword(password: string): Role | null {
  const site = process.env.SITE_PASSWORD || "";
  const admin = process.env.ADMIN_PASSWORD || "";
  if (admin && password === admin) return "admin";
  if (site && password === site) return "member";
  return null;
}

export const COOKIE_MAX_AGE = MAX_AGE_SECONDS;
