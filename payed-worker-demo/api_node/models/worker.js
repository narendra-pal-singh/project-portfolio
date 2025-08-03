const db = require('./../config/database_mysql');
//const db = require('./../config/database_mariadb');
//connection.query('UPDATE users SET Name = ? WHERE UserID = ?', [name, userId])
//connection.query('UPDATE users SET Name = :Name WHERE UserID = :UserID', {UserID: userId, Name: name})
//connection.query('UPDATE users SET ? WHERE UserID = :UserID', {UserID: userId, Name: name})
//connection.query('UPDATE users SET ? WHERE UserID = ?', [{Name: name},userId])
//connection.query('UPDATE user SET ? WHERE ?', [{ Name: name }, { UserId: userId }])
//Make Dynamic Query
// var fields = [{fieldName:"A",value:"one",operator:"AND"},{fieldName:"B",value:"two",operator:""}];
// var query = "SELECT * FROM table WHERE ";
// fields.forEach((f)=>{
//     query=query+`${f.fieldName} = ${f.value} `
//   if(f.operator!="") query=query+f.operator+" "
// })
// console.log(query)
module.exports = {
    update: (data,user_id,callback) =>{

    },
    getGuestUser: (mobile_no,callback) =>{

    },
    getByMobile : (mobile_no,callback) =>{

    },
    
    getById: (user_id,callback) =>{

    },
    
    registerGuestUser: (data,callback) =>{

    },
    acceptTNC: (data,callback) =>{

    },
    getPage: (page_slug,callback) =>{

    },
    getLanguages: (callback) =>{

    },
    //Listing Companies on Singup Page so that new user can choose own compnay
    getCompanies: (callback) =>{
        
    },
    getCities: (state_id,callback) =>{

    },
    getStates: (country_id,callback) =>{

    },
    saveDocument: (data,callback) => {
        
        console.log('Saving Document',data);
        db.query("INSERT INTO document set ? ", data, (err,results) =>{
            if(err){
                //console.log("QUERY ERROR:",err);
                callback(err)
            }
            //console.log("QUERY RESULT:",results);
            return callback(null,results);
        });
            
        
    },
    saveAddress: (data,callback) => {
        
        console.log('Saving Document',data);
        //Check Data exists then save
        db.query("INSERT INTO address_details set ? ", data, (err,results) =>{
            if(err){
                console.log("QUERY ERROR:",err);
                callback(err)
            }
            console.log("QUERY RESULT:",results);
            return callback(null,results);
        });
            
        
    },
    getBankDetailsByID: (id,callback) =>{

    },
    getBankDetails: (user_id,callback) =>{

    },
    saveBankDetails: (data,callback) => {

    },
    updateBankDetails: (data,id,callback) => {
        
    },
    createPayTmLogs: (data,callback) =>{

    },
    updatePayTmLogs: (data,id,callback) =>{

    },
    getPayroll:(employee_id,company_id) =>{

    },
    
    getTotalWithdrawAmount: (employee_id,company_id) =>{

    },
    requestWithdraw: (data,callback) => {

    },
    updateRequestWithdraw: (data,id,callback) => {

    },
    getAttendance: (employee_id,company_id,month=null) =>{

    },
    getWithdrawal: (company_id,user_id,callback) => {

    },
    getMonthTransactions: (filter_data) => {
        var {company_id,employee_id,records,page} = filter_data;
        if(records == undefined) records = 3;
        if(page == undefined) page = 0;
        return new Promise(function(resolve, reject) {
            db.query("SELECT * FROM `withdraw_request` WHERE company_id = ? AND employee_id = ? AND MONTH(created) = MONTH(now()) ORDER BY created DESC LIMIT ? OFFSET ?", [company_id,employee_id,records,page], (err,results) =>{
                if(err){
                    console.log("Query Error=",err);
                    reject(null)
                }
                resolve(results);
            });
            
        });
    },
    getTransactions: (filter_data) => {
        var {company_id,employee_id,records,page} = filter_data;
        if(records == undefined) records = 10;
        if(page == undefined) page = 0;
        return new Promise(function(resolve, reject) {
            const query = db.query("SELECT * FROM `withdraw_request` WHERE company_id = ? AND employee_id = ? ORDER BY created DESC LIMIT ? OFFSET ?", [company_id,employee_id,records,page], (err,results) =>{
                if(err){
                    console.log("Query Error=",err);
                    reject(null)
                }
                resolve(results);
            });
            //console.log("query=",query);
        });
    }
    //These functions will be do by admin
    // getAll: (data,callback) => {
    // },
    // create: (data,callback) => {
    // },
    // softDelete: (data,callback) =>{
    // },
    // hardDelete: (data,callback) =>{
    // },
    // softDeleteGuest: (data,callback) =>{
    // },
    // hardDeleteGuest: (data,callback) =>{
    // }
};