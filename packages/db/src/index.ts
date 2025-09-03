import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import config from "@repo/backend-common/config";
import users, { usersRelations } from "./schemas/users";
import projects, { projectsRelations } from "./schemas/projects";
import chats, { chatsRelations } from "./schemas/chats";
import { redirects } from "./schemas";
import { redirectsRelations } from "./schemas/redirects";

const schema = {
	users,
	projects,
	chats,
	redirects,

	usersRelations,
	projectsRelations,
	chatsRelations,
	redirectsRelations,
};

const client = postgres(config.DB_URL);
export const db = drizzle({ client, schema, logger: true });
