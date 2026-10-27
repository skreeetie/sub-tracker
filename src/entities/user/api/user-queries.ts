import "server-only";
import { eq } from "drizzle-orm";
import type { Currency } from "@/shared/config";
import { db, users } from "@/shared/db";
import type { AuthUserProfile, User } from "../model/user";

const userColumns = {
  id: users.id,
  email: users.email,
  name: users.name,
  displayCurrency: users.displayCurrency,
};

export async function getUserById(id: string): Promise<User | null> {
  const [user] = await db.select(userColumns).from(users).where(eq(users.id, id)).limit(1);
  return user ?? null;
}

/**
 * Пользователь приложения для пользователя Neon Auth: при первом входе создаётся строка в users,
 * при смене имени или email в Neon Auth — обновляется.
 */
export async function syncUserFromAuth(profile: AuthUserProfile): Promise<User> {
  const existing = await getUserById(profile.id);
  if (existing && existing.email === profile.email && existing.name === profile.name) {
    return existing;
  }

  const [user] = await db
    .insert(users)
    .values(profile)
    .onConflictDoUpdate({ target: users.id, set: { email: profile.email, name: profile.name } })
    .returning(userColumns);
  if (!user) {
    throw new Error("Не удалось сохранить пользователя");
  }
  return user;
}

export async function updateUserDisplayCurrency(userId: string, currency: Currency): Promise<void> {
  await db.update(users).set({ displayCurrency: currency }).where(eq(users.id, userId));
}
