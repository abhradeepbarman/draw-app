import "dotenv/config";

const config = {
    PORT: process.env.PORT || 9000,
    DB_URL: process.env.DB_URL || "",
    ACCESS_SECRET: process.env.ACCESS_SECRET || "",
    REFRESH_SECRET: process.env.REFRESH_SECRET || "",
    FRONTEND_URL: process.env.FRONTEND_URL || "",
};

export default config;
