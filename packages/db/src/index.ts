import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import config from "@repo/backend-common/config";
import { refreshTokens, users } from "./schema";

const schema = {
    users,
    refreshTokens,
};

const client = postgres(config.DB_URL);
export const db = drizzle({ client, schema, logger: true });
