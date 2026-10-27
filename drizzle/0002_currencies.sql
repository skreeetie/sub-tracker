CREATE TYPE "public"."currency" AS ENUM('RUB', 'USD', 'EUR', 'GBP', 'CNY', 'KZT', 'TRY');--> statement-breakpoint
CREATE TABLE "exchange_rates" (
	"currency" "currency" PRIMARY KEY NOT NULL,
	"rub_per_unit" double precision NOT NULL,
	"rates_date" date NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exchange_rates_rub_per_unit_positive" CHECK ("exchange_rates"."rub_per_unit" > 0)
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "currency" "currency" DEFAULT 'RUB' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "display_currency" "currency" DEFAULT 'RUB' NOT NULL;