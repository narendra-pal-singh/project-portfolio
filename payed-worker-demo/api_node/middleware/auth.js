require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
//console.log('JWT_REFRESH_TOKEN',JWT_REFRESH_TOKEN);
//console.log('JWT_AUTH_TOKEN',JWT_AUTH_TOKEN);
module.exports = {
    Auth_LOGIN:(req,res,next) => {
        verify(req, res, next, 'login');
    },
    Auth_ACCESS:(req,res,next) => {
        verify(req, res, next, 'access');
    }
};
const verify = (req,res,next, type) => {
    // const token = req.body.token;
    //const token = req.header.authorization;
    const authHeader = req.get('Authorization');
    console.log('TOKEN',authHeader);
    if(!authHeader){
        
        console.log('TOKEN not found');
        res.status(401).send({message:'Access Denied'});
        //res.sendStatus(403); //Forbidden
        // req.isAuth = false;
        // return next();
    }
    const token = authHeader.split(' ')[1];   //validate auth header is exists
    if(!token || token === ''){
        console.log('TOKEN not exists');
        res.status(401).send({message:'Access Denied'});
        //res.sendStatus(403);  //Forbidden
        // req.isAuth = false;
        // return next();
    }
    let decodedToken;
    try {
        if(type == 'access'){
            console.log("Access Auth")
            decodedToken = jwt.verify(token, JWT_AUTH_TOKEN);
        }else{
            console.log("Login Auth")
            decodedToken = jwt.verify(token, JWT_REFRESH_TOKEN);
        }
        console.log("decodedToken",decodedToken);
        
    } catch (error) {
        console.log('TOKEN Error',error);
        res.status(400).send({message:'Invalid Token'});
        //res.sendStatus(403);  //Forbidden
        // req.isAuth = false;
        // return next();
        // return res.status(401).json({
        //     message: 'Auth Failed'
        // })
    }
    if(!decodedToken){
        console.log('Invalid TOKEN');
        res.sendStatus(403); //Forbidden
        // req.isAuth = false;
        // return next();
    }
    // if(type == 'login'){
    //     const user_cookie_data = {
    //         mobile_no: decodedToken.mobile_no,
    //         user_id: decodedToken.user_id
    //     }
    //     const access_token = jwt.sign( user_cookie_data , JWT_AUTH_TOKEN, { expiresIn: '30s' });
    //     return res.status(202).
    //         header('access_token',access_token).
    //         send({message:'Loggge successfully.',access_token:access_token});
    // }
    req.isAuth = true;
    req.loggedData = decodedToken
    next();    
    }