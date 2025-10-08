import "dotenv/config";

export const ENV = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 5001,
    DATABASE_URL: process.env.DATABASE_URL || null,
    NODE_ENV: process.env.NODE_ENV || 'development',
}

export default ENV;