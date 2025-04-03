import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const users = pgTable("users", {
    id: uuid("id").notNull().defaultRandom().primaryKey(),
    name: varchar("name").notNull(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export default users;
