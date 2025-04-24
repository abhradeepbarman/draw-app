ALTER TABLE "chats" RENAME COLUMN "room_id" TO "project_id";--> statement-breakpoint
ALTER TABLE "chats" DROP CONSTRAINT "chats_room_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;