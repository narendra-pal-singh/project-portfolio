
//LocalStore : 
//installed=true        //After setPIN
//setPIN=true           //After SetPIN
//token=access_token    //After SetPIN

export const getLocalToken = () =>{
    return localStorage.getItem("token") || null;
}
export const setLocalToken = (token) =>{
    localStorage.setItem("token",token);
}

//Current Screen
export const getCurrentScreen = () => {
    return localStorage.getItem("currentScreen") || null;
}
export const setCurrentScreen = (value) => {
    return localStorage.setItem("currentScreen",value) || null;
}

//setPIN means User did setPIN while Verfication and Can login in future using Local Token
export const isPINSet = () =>{
    return localStorage.getItem("setPIN") || null;
}
export const setPIN = (value) => {
    return localStorage.setItem("setPIN",value);
}


//<-----------Session Based----------->

//Forgot
export const isForgotPIN = () =>{
    return sessionStorage.getItem("forgotPIN") || null;
}
export const setForgotPIN = (value) => {
    return sessionStorage.setItem("forgotPIN",value);
}

//OTP_VERIFY
export const isOTPVerify = () =>{
    return sessionStorage.getItem("OTPVerify") || null;
}
export const setOTPVerify = (value) => {
    return sessionStorage.setItem("OTPVerify",value);
}

//UnLock App
export const isUnLockAPP = () =>{
    return sessionStorage.getItem("AppUnlock") || null;
}
export const setUnLockAPP = (value) => {
    return sessionStorage.setItem("AppUnlock",value);
}

export const isWithdrawStatusCheck = () =>{
    return sessionStorage.getItem("WithdrawCheck") || null;
}
export const setWithdrawStatus = (value) => {
    return sessionStorage.setItem("WithdrawCheck",value);
}



//User
export const getUser = () =>{
    const userData = sessionStorage.getItem("user");
    if(userData && userData!=='undefined') return JSON.parse(userData); else return null;
}
export const setUser = (user) =>{
    
    if(user && user!=null)
        sessionStorage.setItem("user",JSON.stringify(user));
}

//Token
export const getToken = () => {
    return sessionStorage.getItem("access_token") || null;
}

export const setUserSession = (token =null, user =null) =>{
    
    if(token!=null){
        //Session token for Communication
        sessionStorage.setItem("access_token",token);
    }
    
    if(user!==null && user!==""){
        sessionStorage.setItem("user",JSON.stringify(user));
    }

}

export const removeUserSession = () => {
    // sessionStorage.removeItem("token");
    // sessionStorage.removeItem("user");
    //sessionStorage.clear();
    //localStorage.clear();
}