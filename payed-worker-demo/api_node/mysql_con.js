var mysql = require('mysql');
var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    charset: 'utf8mb4'
});
con.connect(function(err) {
    if(err){
        console.log("Error DB connection");
    }else{
        console.log("Connected!");
    }
    con.end();
});
const user_id = 1;
var sql = "select * from employees where id = ?";
con.query(sql, user_id, function (err, result) {
    console.log("Results: " + result);
});