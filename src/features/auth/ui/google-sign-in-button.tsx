"use client";

import { useState } from "react";
import { authClient } from "@/shared/neon-auth";
import { routes } from "@/shared/config";
import { Button } from "@/shared/ui/button";
import { IconGoogle } from "@/shared/ui/icons";

/** Вход через Google: редирект на Google и обратно в кабинет. Аккаунт создаётся при первом входе. */
export function GoogleSignInButton() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();

  async function signIn() {
    setIsPending(true);
    setError(undefined);
    const { error: signInError } = await authClient.signIn.social({
      provider: "google",
      callbackURL: routes.dashboard,
    });
    // При успехе браузер уже уходит на Google; сюда попадаем только при ошибке.
    if (signInError) {
      setError("Не удалось войти через Google. Попробуйте ещё раз.");
      setIsPending(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Button variant="secondary" onClick={signIn} isLoading={isPending} className="w-full">
        {!isPending && <IconGoogle className="size-4" />}
        Войти через Google
      </Button>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
