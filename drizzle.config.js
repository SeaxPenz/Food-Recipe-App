import { ENV } from './src/config/env.js';
import path from 'path';
import { fileURLToPath } from 'url';

const isDev = ENV.NODE_ENV === 'development';

// Resolve dev.db relative to this config file so it works regardless of cwd
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sqliteUrl = `sqlite:${path.resolve(__dirname, 'dev.db')}`;

export default {
    schema: './src/db/*.js',
    out: './src/db/migrations',
    dialect: isDev ? 'sqlite' : 'postgresql',
    dbCredentials: {
        // use absolute sqlite path for local development if DATABASE_URL is not provided
        url: isDev && !ENV.DATABASE_URL ? sqliteUrl : ENV.DATABASE_URL,
    },
};