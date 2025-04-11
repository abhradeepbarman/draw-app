DROP TABLE "refreshTokens" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refresh_token" varchar;