"use client";

import { createAuthClient } from "@neondatabase/auth/next";

/** Клиент Neon Auth для браузера: запросы идут через наш обработчик /api/auth. */
export const authClient = createAuthClient();
