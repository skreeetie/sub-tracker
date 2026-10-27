import "server-only";
import { createNeonAuth } from "@neondatabase/auth/next/server";
import { getAuthEnv } from "@/shared/config/env";

const env = getAuthEnv();

/** Серверный клиент Neon Auth: сессия, вход/регистрация, обработчик /api/auth и proxy. */
export const auth = createNeonAuth({
  baseUrl: env.NEON_AUTH_BASE_URL,
  cookies: { secret: env.NEON_AUTH_COOKIE_SECRET },
});
