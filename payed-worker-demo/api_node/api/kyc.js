

//verifyDoc
//verifyAadharOTP using VERIFY_AADHAR_OTP_API
//getAadharData using GET_AADHAR_DATA_API
//verifyBankAccount using by karza.in/v2/bankacc API
//checkIFSC using by karza.in/v2/ifsc API

const https = require('https');
var URL = require('url');

const KARZA_API_KEY = process.env.KARZA_API_KEY;

const DL_API = process.env.DL_API;
const PAN_API = process.env.PAN_API;

const AADHAR_OTP_API = process.env.AADHAR_OTP_API;
const VERIFY_AADHAR_OTP_API = process.env.VERIFY_AADHAR_OTP_API;
const GET_AADHAR_DATA_API = process.env.GET_AADHAR_DATA_API;

