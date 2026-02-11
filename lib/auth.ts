const SALT = "photo-portfolio-admin";

export const COOKIE_NAME = "admin_session";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function hmacSign(data: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(data)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createToken(password: string): Promise<string> {
  return hmacSign(password, SALT);
}

export async function verifyToken(token: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const expected = await createToken(password);
  return token === expected;
}
