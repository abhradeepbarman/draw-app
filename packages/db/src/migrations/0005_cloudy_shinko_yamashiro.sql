ALTER TABLE "projects" RENAME COLUMN "slug" TO "name";--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_slug_unique";