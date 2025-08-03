require('dotenv').config();


const mysql = require('mysql');

// const db = mysql.createConnection({
//     port: 3306,
//     host: process.env.DB_HOST,
//     user: process.env.USER_NAME,
//     password: process.env.DB_PW,
//     database: process.env.DB_NAME,
//     connectionLimit: 10
// });

const db = mysql.createConnection({
    // port: 3306,
    host: 'localhost',
    user: 'root',
    password: '##123',
    database: 'payed',
    connectionLimit: 10,
    timezone: 'utc'
});

db.connect(function (err) {
    if (err) {
        console.log("Error DB connection");
    } else {
        console.log("Connected!");
    }
});
//db.end();


module.exports = db;