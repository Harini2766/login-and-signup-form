// db.js
const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',     // change if you have a password
    database: 'auth_demo'
});

conn.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected!');
});

module.exports = conn;
