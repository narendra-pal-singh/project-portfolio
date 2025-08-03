const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const workerRoutes = require('./routes/worker');
const adminRoutes = require('./routes/admin');
// app.use((req, res, next) =>{
//     res.status(200).json({
//         message:'hello world!!!!'
//     })
// });
app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//app.use(express.urlencoded({ limit: "50mb", parameterLimit: 500000000 }));
//app.use(cookieParser());
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // if(req.method === 'OPTIONS'){
    //     res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, PATCH');
    //     return res.status(200).json({});
    // }
    next();
});
app.use('/worker',workerRoutes);
//app.use('/hr',adminRoutes);
app.use((req,res,next)=>{
    const error = new Error('Invalid Request');
    error.status = 404;
    next(error);
});
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
});
module.exports = app;