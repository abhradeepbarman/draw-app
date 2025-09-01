import config from "@repo/backend-common/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/schemas",
	out: "./src/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: config.DB_URL,
	},
});
