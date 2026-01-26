require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function getUserByUsername(username) {
    const [rows] = await pool.execute(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );
    return  rows[0];
}

module.exports = { getUserByUsername };
