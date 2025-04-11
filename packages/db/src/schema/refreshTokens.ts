import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const refreshTokens = pgTable("refreshTokens", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    token: varchar("token").unique().notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
        .notNull()
        .defaultNow(),
});

export default refreshTokens;
