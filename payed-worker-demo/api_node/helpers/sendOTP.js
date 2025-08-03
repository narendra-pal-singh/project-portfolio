
const sendOTP = (phone,otp=null)=>{

    if(phone && phone !=''){
        return true;
    }else{
        return false;
    }

}

module.exports = sendOTP;