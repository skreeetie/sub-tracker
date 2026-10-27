ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
-- Демо-аккаунт моковой авторизации больше не нужен: его подписки удаляются каскадом (subscriptions.user_id ON DELETE CASCADE).
DELETE FROM "users" WHERE "email" = 'demo@sub-tracker.local';
