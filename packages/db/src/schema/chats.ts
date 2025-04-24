import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import users from "./users";
import projects from "./projects";

const chats = pgTable("chats", {
    id: uuid("id").notNull().defaultRandom().primaryKey(),
    message: varchar("message").notNull(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, {
            onUpdate: "no action",
            onDelete: "cascade",
        }),
    projectId: uuid("project_id")
        .notNull()
        .references(() => projects.id, {
            onUpdate: "no action",
            onDelete: "cascade",
        }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const chatsRelations = relations(chats, ({ one }) => ({
    user: one(users, {
        fields: [chats.userId],
        references: [users.id],
    }),
    project: one(projects, {
        fields: [chats.projectId],
        references: [projects.id],
    }),
}));

export default chats;
