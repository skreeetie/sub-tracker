import { auth } from "@/shared/neon-auth/index.server";

// Проксирует запросы клиента Neon Auth (вход через Google, сессия) к сервису авторизации.
export const { GET, POST } = auth.handler();
