import { cookies } from "next/headers";

const COOKIE = "evidra_sid";

export async function readSessionId() {
  const jar = await cookies();
  return jar.get(COOKIE)?.value ?? null;
}

export async function getOrCreateSessionId() {
  const jar = await cookies();
  const existing = jar.get(COOKIE)?.value;
  if (existing) return existing;
  const id = crypto.randomUUID();
  jar.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  });
  return id;
}
