'use strict';
const FileType = require('file-type');
//const fs = require('fs');
const path = require('path');
const multer = require('multer');
//const upload = multer({dest:'/public/worker/selfie/'});
const selfieFolder = './public/worker/selfie/';
const documentFolder = './public/worker/documents/'
const storage = multer.diskStorage({
    //destination: './public/worker/selfie/',
    destination: (req, file, callback) => {

    },
    filename: function (req,file,callback){

    }
});
const upload = multer({
    storage:storage,
    limits:{fileSize:5242880},
    fileFilter:function(req,file,cb){
        checkFileType(file,cb)
    }
}).single('document_file');
function checkFileType(file,cb){
    //Allow ext
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    //check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    }else{
        return cb('Invalid Doucument, Please upload photo and pdf file only');
    }
}
module.exports = (req,res,next,cb) => {
    upload(req,res,(err)=>{
        if(err){
            console.log('Upload Error:',err);
            msg = err.message ? err.message : err;
            //res.send({msg:msg});
            cb(msg);
        }else{
            cb(null);
        }
    });
    //next();
}
