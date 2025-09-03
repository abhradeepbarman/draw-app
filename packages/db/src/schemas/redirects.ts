import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import projects from "./projects";
import { timestamp } from "drizzle-orm/pg-core";
import { boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const redirects = pgTable("redirects", {
	id: uuid("id").notNull().defaultRandom().primaryKey(),
	projectId: uuid("project_id")
		.notNull()
		.references(() => projects.id, {
			onUpdate: "no action",
			onDelete: "cascade",
		}),
	editable: boolean("editable").notNull().default(false),
	// after 24 hours, expiry
	expiryAt: timestamp("expiry_at").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const redirectsRelations = relations(redirects, ({ one }) => ({
	project: one(projects, {
		fields: [redirects.projectId],
		references: [projects.id],
	}),
}));

export default redirects;
