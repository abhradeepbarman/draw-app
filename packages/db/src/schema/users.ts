import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const users = pgTable("users", {
    id: uuid("id").notNull().defaultRandom().primaryKey(),
    name: varchar("name").notNull(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    refreshToken: varchar("refresh_token"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export default users;
