const { Pool } = require('pg');
const dotenv = require("dotenv")
dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRE_USER,
  host: process.env.POSTGRE_HOST,
  database: process.env.POSTGRE_DATABASE,
  password: process.env.POSTGRE_PASSWORD,
  port: process.env.POSTGRE_POST,
  max: 20,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 30000,
});

module.exports = { pool };