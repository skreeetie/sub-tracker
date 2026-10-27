import "server-only";
import { cookies } from "next/headers";

// Email, который ждёт подтверждения кодом: в httpOnly-cookie, а не в URL.
const cookieName = "sub_tracker_pending_email";
const maxAgeSeconds = 60 * 60;

export async function setPendingVerificationEmail(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function getPendingVerificationEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(cookieName)?.value || null;
}

export async function clearPendingVerificationEmail() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}
