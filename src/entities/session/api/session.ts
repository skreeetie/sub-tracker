import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { z } from "zod";
import { getUserById, type User } from "@/entities/user/@x/session";
import { routes, sessionCookie } from "@/shared/config";

// Моковая сессия: в cookie лежит id пользователя. Реальная авторизация вне рамок MVP —
// при её появлении меняется только этот файл и features/auth.

const userIdSchema = z.uuid();

/** Текущий пользователь или null. Кэшируется на время одного запроса. */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const userId = cookieStore.get(sessionCookie.name)?.value;
  if (!userId || !userIdSchema.safeParse(userId).success) {
    return null;
  }
  return getUserById(userId);
});

/** Текущий пользователь; гостя перенаправляет на стартовую страницу. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(routes.home);
  }
  return user;
}

export async function createSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookie.name, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionCookie.maxAgeSeconds,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookie.name);
}
