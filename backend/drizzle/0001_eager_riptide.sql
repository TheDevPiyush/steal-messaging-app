ALTER TABLE "users" ADD COLUMN "photo_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "loginOTP" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "loginOTPExpiresAt" timestamp;