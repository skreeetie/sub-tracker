/** Cookie моковой сессии. Хранит id пользователя — без подписи, только для MVP без авторизации. */
export const sessionCookie = {
  name: "sub_tracker_session",
  maxAgeSeconds: 60 * 60 * 24 * 30,
} as const;
