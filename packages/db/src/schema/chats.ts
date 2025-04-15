import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import users from "./users";
import rooms from "./rooms";
import { relations } from "drizzle-orm";

const chats = pgTable("chats", {
    id: uuid("id").notNull().defaultRandom().primaryKey(),
    message: varchar("message").notNull(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, {
            onUpdate: "no action",
            onDelete: "cascade",
        }),
    roomId: uuid("room_id")
        .notNull()
        .references(() => rooms.id, {
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
    room: one(rooms, {
        fields: [chats.roomId],
        references: [rooms.id],
    }),
}));

export default chats;
