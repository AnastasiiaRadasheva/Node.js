const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// READ
async function getNews() {
    const [rows] = await pool.query("SELECT * FROM news ORDER BY id DESC");
    return rows;
}

// READ
async function getNewsById(id) {
    const [rows] = await pool.query(
        "SELECT * FROM news WHERE id = ?",
        [id]
    );
    return rows[0];
}

// CREATE
async function createNews(title, content) {
    const [result] = await pool.execute(
        "INSERT INTO news (title, content, created_at) VALUES (?, ?, NOW())",
        [title, content]
    );
    return result;
}

// UPDATE
async function updateNewsById(id, title, content) {
    const [result] = await pool.execute(
        "UPDATE news SET title = ?, content = ? WHERE id = ?",
        [title, content, id]
    );
    return result;
}

// DELETE
async function deleteNewsById(id) {
    const [result] = await pool.execute(
        "DELETE FROM news WHERE id = ?",
        [id]
    );
    return result;
}

module.exports = {
    getNews,
    getNewsById,
    createNews,
    updateNewsById,
    deleteNewsById
};
