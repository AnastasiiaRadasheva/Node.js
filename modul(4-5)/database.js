const mysql = require('mysql2/promise');
require('dotenv').config();

// Ühendus andmebaasiga
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// READ - kõik andmed (kursusel: news)
async function getNews() {
    const [rows] = await pool.query('SELECT * FROM news');
    return rows;
}

// eksport (VÄGA TÄHTIS)
module.exports = { getNews };
async function getNewsById(id) {
    const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    return rows[0];
}
// DELETE üks uudis
async function deleteNewsById(id) {
    await pool.query("DELETE FROM news WHERE id = ?", [id]);
}
async function createNews(title, content) {
    return pool.execute(
        "INSERT INTO news (title, content) VALUES (?, ?)",
        [title, content]
    );
}
async function updateNewsById(id, title, content) {
    await pool.query(
        "UPDATE news SET title = ?, content = ? WHERE id = ?",
        [title, content, id]
    );
}
//kasutaja leidmine kasutajanime alusel
async function getUserByUsername(username) {
    const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );
    return rows[0];
}


module.exports = {
    getNews,
    getNewsById,
    createNews,
    updateNewsById,
    deleteNewsById,
    getUserByUsername
};
