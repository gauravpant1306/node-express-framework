const mysql = require('mysql2');

const dotenv = require("dotenv")
dotenv.config();
console.log(process.env.DB_USER)
const pool = mysql.createPool({
  connectionLimit: 3,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = { pool };