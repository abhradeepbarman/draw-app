import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import users from "./users";
import { relations } from "drizzle-orm";
import chats from "./chats";
import redirects from "./redirects";

const projects = pgTable("projects", {
	id: uuid("id").notNull().defaultRandom().primaryKey(),
	name: varchar("name").default("New Project").notNull(),
	adminId: uuid("admin_id").references(() => users.id, {
		onUpdate: "no action",
		onDelete: "cascade",
	}),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
	admin: one(users, {
		fields: [projects.adminId],
		references: [users.id],
	}),
	chats: many(chats),
	redirects: one(redirects, {
		fields: [projects.id],
		references: [redirects.projectId],
	}),
}));

export default projects;
