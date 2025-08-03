const APP_URL = process.env.REACT_APP_URL;
//const API_URL = ''; //process.env.REACT_APP_API_URL;
//const API_URL = 'http://192.168.29.53/payed/api';
//const API_URL = 'http://localhost/payed/api';
//const API_URL = 'https://api.swagat.app/payed';
const API_URL = 'http://localhost:3030/worker';
const KYC_URL = 'https://testapi.karza.in';
const BANK_URL = '';
// console.log('APP_URL=',APP_URL);
console.log('API=',API_URL);
//CurrentScreen Route
export const CS_ROUTE = {
    'home'      : '/',
    'get_otp'   : '/login',
    'resend_otp': '/login/resend_otp',
    'verify_otp': '/login/verify_otp',
    'unlock_app': '/unlock_app',
    'signup'    : '/login/signup',
    'thankyou'  : '/login/thankyou',
    'tnc'       : '/login/tnc',
    'set_pin'   : '/login/set_pin',
    'welcome'   : 'login/welcome',
    'set_language':'/login/language',
    'basic_info': '/basic_info',
    'selfie'    : '/basic_info/selfie',
    'dashboard' : '/dashboard',
    'account_verify'    :'account_verification',
    'kyc'               : '/kyc',
    //KYC
    'pan_card'      : '/kyc/pan_card',
    'aadhar_card'   : '/kyc/aadhar_card',
    'aadhar_otp'    : '/kyc/aadhar_card/otp',
    'dl'            : '/kyc/dl',
    //Bank Verification
    'bank_details'  : '/kyc/bank_details',
    // 'address_proof' : '/kyc/address_proof',
    // 'voter_id'      : '/kyc/address_proof/voter_id',
    // 'rent_agreement': '/kyc/address_proof/rent_agreement',
    // 'hr_letter'     : '/kyc/address_proof/hr_letter',
    // 'address_details': '/kyc/address_details',
    '404': '/404'
}
export const API_ROUTE = {
    'GET_OTP'       : API_URL+'/get_otp',
    'RESEND_OTP'    : API_URL+'/resend_otp',
    'VERIFY_OTP'    : API_URL+'/verify_otp',
    'SIGNUP'        : API_URL+'/save_user',
    'GET_COMPANIES' : API_URL+'/get_companies',
    'SAVE_PIN'      : API_URL+'/set_pin',
    'VERIFY_PIN'    : API_URL+'/verify_pin',
    'FORGOT_PIN'    : API_URL+'/forgot_pin',
    'TNC'           : API_URL+'/get_tnc',
    'AcceptTNC'     : API_URL+'/accept_tnc',
    'confirmData'     : API_URL+'/cofirm_data',
    // 'GET_LANG'      : API_URL+'/get_languages',
    // 'SET_LANG'      : API_URL+'/set_language',
    // 'BASIC_INFO'    : API_URL+'/save_basic_info',
    
    'GET_USER'      : API_URL+'/get_user',
    'UPLOAD_DOC'    : API_URL+'/upload',
    'VERIFY_DOC'    : API_URL+'/verify_doc',
    'AADHAR_OTP'    : API_URL+'/aadhar_otp',
    
    'SAVE_BANK'      : API_URL+'/save_bank',
    'SAVE_ADDRESS'      : API_URL+'/save_address',
    'SAVE_KYC'      : API_URL+'/save_kyc_info',
    'GET_KYC'       : API_URL+'/get_kyc_info',
    'WITHDRAW_REQ'  : API_URL+'/withdraw_request',
    'WITHDRAW_STATUS'  : API_URL+'/check_transaction',
    'TRANS'  : API_URL+'/get_transactions',
    'ATTEND'  : API_URL+'/get_attendance',
    
    'VERIFY_REQ'    : API_URL+'/verify_request',
    'GET_STATES'    : API_URL+'/get_states',
    'GET_CITIES'    : API_URL+'/get_cities',
}
// export const KYC_API = {
//     'DL'            : KYC_URL+'/v3/dl',
//     'PAN'           : KYC_URL+'/v2/pan',
//     'AADHAAR_CON'   : KYC_URL+'/v3/aadhaar-consent',
//     'AADHAAR_VER'   : KYC_URL+'/v2/aadhaar-verification',
// }
// export const BANK_API = {
//     'DL'            : KYC_URL+'/v3/dl',
//     'PAN'           : KYC_URL+'/v2/pan',
//     'AADHAAR_CON'   : KYC_URL+'/v3/aadhaar-consent',
//     'AADHAAR_VER'   : KYC_URL+'/v2/aadhaar-verification',
// }
export const CONFIG = {
    SERVER_URL: APP_URL,
    IMG_PATH : "./../../assets/images/",
    IMG_PATH_URL : APP_URL+'/assets/images/',
    OTP_TIMER: 59,
    REDIRECT_TIMER: 30
}