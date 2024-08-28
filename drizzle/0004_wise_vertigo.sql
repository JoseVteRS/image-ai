ALTER TABLE "subscription" ADD COLUMN "customerId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription" DROP COLUMN IF EXISTS "cusomerId";