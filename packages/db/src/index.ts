import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import config from "@repo/backend-common/config";
import { chats, rooms, users } from "./schema";
import { usersRelations } from "./schema/users";
import { roomsRelations } from "./schema/rooms";
import { chatsRelations } from "./schema/chats";

const schema = {
    users,
    rooms,
    chats,

    usersRelations,
    roomsRelations,
    chatsRelations,
};

const client = postgres(config.DB_URL);
export const db = drizzle({ client, schema, logger: true });
