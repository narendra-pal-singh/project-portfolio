const db = require('./../config/database');
module.exports = {
    get : (data,callback) =>{
        db.query('select * from user where id = ?',user_id,(error,results,fields)=>{
            if(error){
                callback(error)
            }
            return callback(null,results);
        });
    },
    create: (data,callback) =>{
        
    }
};