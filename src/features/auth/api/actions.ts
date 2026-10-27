"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/entities/session";
import { getUserByEmail } from "@/entities/user/index.server";
import { demoUser, routes } from "@/shared/config";

/** Моковый вход: без ввода данных открывает сессию демо-пользователя. */
export async function loginAsDemo() {
  const user = await getUserByEmail(demoUser.email);
  if (!user) {
    throw new Error("Демо-пользователь не найден в базе. Выполни pnpm db:seed.");
  }
  await createSession(user.id);
  redirect(routes.dashboard);
}

export async function logout() {
  await deleteSession();
  redirect(routes.home);
}
