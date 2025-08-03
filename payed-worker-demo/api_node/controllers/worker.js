//"use strict";
require('dotenv').config();
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Worker = require('../models/worker')
const sendOTP = require('../helpers/sendOTP');
const fileUpload = require('../helpers/fileUpload');
const PAYTM = require('../api/paytm');
const KYC = require('../api/kyc');
const ORC = require('../api/ocr');
const FetchOCR = require('../api/ocr');
const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
const smsKey = process.env.SMS_SECRET_KEY;
//console.log('JWT_REFRESH_TOKEN',JWT_REFRESH_TOKEN);
const User_FIELDS = ['first_name', 'last_name', 'dob', 'gender', 'email', 'mobile_no', 'selfie_url', 'pin_no', 'kyc_verified','bank_verified', 'current_screen', 'accept_tnc', 'net_salary', 'withdraw_limit_percentage'];
module.exports = {
    getOTP: (req, res, next) => {

    },
    getOTPByVoice: (req, res) => {

    },
    verifyOTP: (req, res, next) => {

    },
    getWorker: async (req, res) => {

    },
    getGuestUser: (req, res) => {

    },
    //If worker doesn't exists then register
    registerGuestUser: (req, res) => {

    },
    setPIN: (req, res, next) => {
    },
    verifyPIN: (req, res, next) => {

    },
    getPage: (req, res, next) => {

    },
    acceptTNC: (req, res, next) => {

    },
    confirmData: (req, res, next) => {

    },
    getCities: (req, res, next) => {

    },
    getStates: (req, res, next) => {

    },
    //Listing Companies on Singup Page so that new user can choose own compnay
    getCompanies: (req, res, next) => {

    },
    getLanguages: (req, res, next) => {

    },
    setLanguage: (req, res, next) => {

    },
    saveBasicInfo: (req, res, next) => {

    },
    uploadDoc: (req, res, next) => {

    },
    verify_doc: (req, res, next) => {

    },
    aadharOTP: async (req, res, next) => {

    },

    saveAddress: (req, res, next) => {

    },
    // saveBankDetails: (req,res,next) =>{

    // },
    saveBankDetails: (req, res, next) => {

    },
    verifyRequest: (req, res, next) => {

    },
    requestWithdraw: async(req, res, next) => {

    },
    getTransactions: async (req, res) => {

    },
    getAttendance: async (req, res) => {

    },

    checkLastTransaction: async (req, res) => {

    },
}
function filterKeys(raw, allowed) {

}
function formatJSDate(date = null, formatFrom = '', formatTo = '') {

}
function getWeekNumber(){
    
}