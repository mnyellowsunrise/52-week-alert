// db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_52WEEK,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
