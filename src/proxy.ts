import { auth } from "@/shared/neon-auth/index.server";
import { routes } from "@/shared/config";

// Быстрый редирект гостя на страницу входа и обновление сессии.
// Окончательная проверка доступа — в лейауте кабинета и в каждом server action (requireUser).
export default auth.middleware({ loginUrl: routes.signIn });

export const config = {
  matcher: ["/dashboard/:path*", "/subscriptions/:path*", "/profile/:path*"],
};
