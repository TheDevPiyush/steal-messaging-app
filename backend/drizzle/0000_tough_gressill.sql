CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"username" text,
	"created_at" timestamp DEFAULT now(),
	"photo_url" text,
	"loginOTP" text,
	"loginOTPExpiresAt" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
