const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'blognio1@gmail.com', // Replace with your MySQL username
    password: 'C-11abbage', // Replace with your MySQL password
    database: 'tasks_db'
});

module.exports = pool.promise();
