const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const isDev = process.env.NODE_ENV === 'development';
// Use in-memory sqlite for a safe local run (no file path issues)
const sqliteUrl = 'sqlite::memory:';

module.exports = {
  schema: './src/db/*.js',
  out: './src/db/migrations',
  dialect: isDev ? 'sqlite' : 'postgresql',
  dbCredentials: {
    // In development always use the local sqlite file to avoid remote driver/websocket issues
    url: isDev ? sqliteUrl : process.env.DATABASE_URL,
  },
};
``