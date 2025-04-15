import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import rooms from "./rooms";
import chats from "./chats";

const users = pgTable("users", {
    id: uuid("id").notNull().defaultRandom().primaryKey(),
    name: varchar("name").notNull(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    refreshToken: varchar("refresh_token"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
    rooms: many(rooms),
    chats: many(chats),
}));

export default users;
