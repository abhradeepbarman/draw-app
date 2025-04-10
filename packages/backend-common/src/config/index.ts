import "dotenv/config";

const config = {
    PORT: process.env.PORT || 9000,
    DB_URL: process.env.DB_URL || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
};

export default config;
