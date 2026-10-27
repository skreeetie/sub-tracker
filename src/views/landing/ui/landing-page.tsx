import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/entities/session";
import { routes } from "@/shared/config";
import { buttonClassName } from "@/shared/ui/button";
import { UpcomingPreview } from "./upcoming-preview";

export async function LandingPage() {
  // Уже вошедшему пользователю стартовая не нужна — сразу в кабинет.
  if (await getCurrentUser()) {
    redirect(routes.dashboard);
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 py-12 md:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-20">
      <div className="max-w-xl">
        <h1 className="font-display text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
          Знайте, когда и сколько спишут за подписки
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted text-pretty">
          Внесите сервисы, на которые подписаны. Sub Tracker посчитает траты по месяцам и категориям
          и за неделю напомнит о продлении.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={routes.signUp} className={buttonClassName({ size: "lg" })}>
            Зарегистрироваться
          </Link>
          <Link href={routes.signIn} className={buttonClassName({ variant: "secondary", size: "lg" })}>
            Войти
          </Link>
        </div>
      </div>
      <UpcomingPreview />
    </div>
  );
}
