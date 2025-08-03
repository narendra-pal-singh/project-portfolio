require('dotenv').config();
//const mysqldb = require('mariadb');
const mysqldb = require('mysql');

// const pool = createPool({
//     port:    process.env.DB_PORT,
//     host:    process.env.DB_HOST,
//     user:    process.env.DB_USERNAME,
//     password:process.env.DB_PASSWORD,
//     database:process.env.DB_DATABASE,
//     connectionLimit: 10
// });

// const db = mariadb.createPool({
//     port: 3306,
//     host: 'localhost',
//     user: 'root',
//     password: '##123',
//     database: '####',
//     connectionLimit: 10
// });

const db = mysqldb.createPool({
    port: 3306,
    host: process.env.DB_HOST,
    user: process.env.USER_NAME,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    connectionLimit: 10
});

//Connection and check for errors
db.getConnection( (err, connection ) =>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('Database connection lost');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            //Send Mail to Client
            console.error('Database has too many connection');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('Database connection was refused');
        }
    }
    if(connection) connection.release();

    return ;
} )

module.exports = db;