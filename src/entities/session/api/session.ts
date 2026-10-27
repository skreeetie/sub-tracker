import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { syncUserFromAuth, type User } from "@/entities/user/@x/session";
import { auth } from "@/shared/neon-auth/index.server";
import { routes } from "@/shared/config";

// Сессия — Neon Auth. Остальной код получает пользователя только через getCurrentUser() / requireUser().

/** Текущий пользователь или null (гость или email не подтверждён). Кэшируется на время одного запроса. */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  // Сессия зависит от cookie запроса: помечаем рендер динамическим до вызова SDK,
  // иначе при сборке Neon Auth логирует перехваченную ошибку пререндера.
  await connection();
  const { data } = await auth.getSession();
  const authUser = data?.user;
  if (!authUser || !authUser.emailVerified) {
    return null;
  }
  return syncUserFromAuth({
    id: authUser.id,
    email: authUser.email,
    name: authUser.name || authUser.email,
  });
});

/** Текущий пользователь; гостя перенаправляет на страницу входа. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(routes.signIn);
  }
  return user;
}
