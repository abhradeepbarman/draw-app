import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import users from "./users";
import { relations } from "drizzle-orm";
import chats from "./chats";

const rooms = pgTable("rooms", {
    id: uuid("id").notNull().defaultRandom().primaryKey(),
    slug: varchar("slug").notNull().unique(),
    adminId: uuid("admin_id").references(() => users.id, {
        onUpdate: "no action",
        onDelete: "cascade",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const roomsRelations = relations(rooms, ({ one, many }) => ({
    admin: one(users, {
        fields: [rooms.adminId],
        references: [users.id],
    }),
    chats: many(chats),
}));

export default rooms;
