ALTER TABLE "rooms" RENAME TO "projects";--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "rooms_slug_unique";--> statement-breakpoint
ALTER TABLE "chats" DROP CONSTRAINT "chats_room_id_rooms_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "rooms_admin_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_room_id_projects_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_slug_unique" UNIQUE("slug");