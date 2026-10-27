import type { Currency } from "@/shared/config";

export interface User {
  id: string;
  email: string;
  name: string;
  /** Основная валюта: в неё пересчитываются итоги дашборда. */
  displayCurrency: Currency;
}

/** Данные пользователя из сессии Neon Auth, которые копируются в users. */
export type AuthUserProfile = Pick<User, "id" | "email" | "name">;
