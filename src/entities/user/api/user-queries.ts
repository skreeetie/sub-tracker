import "server-only";
import { eq } from "drizzle-orm";
import { db, users } from "@/shared/db";
import type { User } from "../model/user";

const userColumns = {
  id: users.id,
  email: users.email,
  name: users.name,
};

export async function getUserById(id: string): Promise<User | null> {
  const [user] = await db.select(userColumns).from(users).where(eq(users.id, id)).limit(1);
  return user ?? null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await db.select(userColumns).from(users).where(eq(users.email, email)).limit(1);
  return user ?? null;
}
