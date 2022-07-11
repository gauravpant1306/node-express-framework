const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 3,
  host: 'localhost',
  user: 'root',
  password: 'MySql@11',
  database: 'data'
});

module.exports = { pool };