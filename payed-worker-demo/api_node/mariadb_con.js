require('dotenv').config();
const mariadb = require('mariadb');
// const db = mariadb.createPool({
//     port: 3306,
//     host: 'localhost',
//     user: 'root',
//     password: 'admin##123',
//     database: 'mmch',
//     connectionLimit: 10
// });
const db = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
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
});
async function getData(data,callback){
    try {
        const user_id = 1;
        const row = await db.query('select * from employees where id=?',user_id);
        if(row){
            console.log('Row=',row)
            callback(null,row);
        }else{
            console.log('no data')
        }    
    } catch (error) {
        callback('Query Error!');
    }
}
getData(null,(err,results)=>{
    if(err){
        console.log("Err",err);
    }
    if(results){
        console.log("Result",results);
    }
    console.log("Errrrrrrrrr");
});
