// server.js 
//server file
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Serve login page at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

// SIGNUP
app.post('/signup', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const sql = 'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [firstName, lastName, email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.send('Error creating account');
        }
        res.redirect('/login.html');
    });
});

// LOGIN
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            req.session.user = results[0];
            res.redirect('/home');
        } else {
            res.send('Invalid credentials');
        }
    });
});

// HOME (after login)
app.get('/home', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'views/home.html'));
    } else {
        res.redirect('/login.html');
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
