import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import config from "@repo/backend-common/config";
import { chats, projects, users } from "./schema";
import { usersRelations } from "./schema/users";
import { chatsRelations } from "./schema/chats";
import { projectsRelations } from "./schema/projects";

const schema = {
    users,
    projects,
    chats,

    usersRelations,
    projectsRelations,
    chatsRelations,
};

const client = postgres(config.DB_URL);
export const db = drizzle({ client, schema, logger: true });
