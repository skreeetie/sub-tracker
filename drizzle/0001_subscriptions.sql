CREATE TYPE "public"."billing_period" AS ENUM('monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."subscription_category" AS ENUM('video', 'music', 'software', 'cloud', 'games', 'education', 'other');--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"price_minor" integer NOT NULL,
	"billing_period" "billing_period" NOT NULL,
	"category" "subscription_category" NOT NULL,
	"start_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_price_minor_positive" CHECK ("subscriptions"."price_minor" > 0),
	CONSTRAINT "subscriptions_name_length" CHECK (char_length("subscriptions"."name") between 1 and 100)
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions" USING btree ("user_id");