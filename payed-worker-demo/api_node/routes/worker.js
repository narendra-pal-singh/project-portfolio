const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const {Auth_LOGIN,Auth_ACCESS} = require('../middleware/auth');

const ctrlWorker = require('./../controllers/worker');

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'worker details'
    })
});


//201 -
//404 - fail

// 200 OK                      Request Successful
// 201 Created 
// 202 Accepted     //Action Done like Delete,UPdate
// 204 No content   //Record or data not found
// 400 Bad Request             Mandatory fields are missing / invalid
// 401 Unauthorized Access     API Key is missing or invalid.
// 402 Insufficient Credits    Credits to access the APIs expired.
// 403 Forbidden
// 404 Not Found 
// 500 Internal Server Error   Internal processing error of Karza.
// 503 Source Unavailable      The source for authentication is down for maintenance or inaccessible.
// 504 Endpoint Request Timed Out  The response latency from the source for authentication is >30sec.



router.post('/get_otp', ctrlWorker.getOTP );
//router.post('/voice_otp', ctrlWorker.voiceOTP);
router.post('/verify_otp', ctrlWorker.verifyOTP);

router.get('/get_companies', ctrlWorker.getCompanies);

//Register User if he/she not exists in employee table
router.post('/save_user', ctrlWorker.registerGuestUser);

router.post('/set_pin', Auth_ACCESS, ctrlWorker.setPIN);
router.post('/verify_pin', Auth_LOGIN, ctrlWorker.verifyPIN);



router.post('/get_tnc', ctrlWorker.getPage );
router.post('/accept_tnc', Auth_ACCESS, ctrlWorker.acceptTNC);

// router.get('/get_languages', ctrlWorker.getLanguages);
// router.post('/set_language',Auth_ACCESS, ctrlWorker.setLanguage);

router.post('/get_user', Auth_ACCESS,  ctrlWorker.getWorker );
router.post('/cofirm_data', Auth_ACCESS,  ctrlWorker.confirmData );

//router.post('/save_basic_info', Auth_ACCESS, ctrlWorker.saveBasicInfo);

//router.post('/save_address', Auth_ACCESS, ctrlWorker.saveAddress);

router.post('/save_bank', Auth_ACCESS, ctrlWorker.saveBankDetails);

router.post('/get_states', ctrlWorker.getStates);
router.post('/get_cities', ctrlWorker.getCities);


router.post('/upload', Auth_ACCESS, ctrlWorker.uploadDoc );

router.post('/verify_doc', Auth_ACCESS, ctrlWorker.verify_doc );
router.post('/aadhar_otp', Auth_ACCESS, ctrlWorker.aadharOTP );
// router.post('/aadhar_verify', Auth_ACCESS, ctrlWorker.uploadDoc );


// router.post('/save_kyc', (req, res, next) => {
//     res.status(200).json({
//         message: 'verify'
//     })
// });

router.post('/verify_request', Auth_ACCESS, ctrlWorker.verifyRequest);
router.post('/withdraw_request', Auth_ACCESS, ctrlWorker.requestWithdraw);

//Get Transactions for View Transaction Page
router.post('/get_transactions', Auth_ACCESS, ctrlWorker.getTransactions);
router.post('/get_attendance', Auth_ACCESS, ctrlWorker.getAttendance);


router.post('/check_transaction', Auth_ACCESS, ctrlWorker.checkLastTransaction);


router.get('/logout',(req,res) =>{

    // const refreshToken = jwt.sign( {user_id:1233,mobile_no:'8887955401'} , JWT_REFRESH_TOKEN, { expiresIn: '1y' });
    // res.status(202).
    // cookie('refreshToken', refreshToken, { expires: new Date(new Date().getTime() + 30 * 1000), sameSite: 'strict', httpOnly: true }).send({msg:'user logged'});
    
    res.clearCookie('login_token').clearCookie('access_token').send('User Logged Out');

    // console.log("Rer Cookie",req.cookies);
    // console.log("Res Cookie",res.cookies);
    // res.status(200).json({
    //     message: 'logout'
    // })

});

module.exports = router;