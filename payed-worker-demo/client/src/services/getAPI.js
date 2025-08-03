import { serializeJSON } from '../helper/Funcs';
import { getLocalToken,getToken } from "../session/Control";

import {API_ROUTE} from "../data/Config"



export const  callAPI = async( URL , pData = []) => {
    
    //const URL = API_ROUTE['GET_STATES'];

    let returnData = {};
    
    const reqOptions = {
        method: "POST",
        //headers: {'Content-Type': 'application/json'},
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        //body: JSON.stringify({mobile_no:mobile_no,otp:enter_otp,token:token})
        body: serializeJSON(pData) + '&access_token=' + getToken()
      }

    return returnData = await fetch(URL,reqOptions)
        .then(response => response.json())
        .then((resData)=>{
            return resData;
        })
        .catch(error =>{
            return error;
        });
};

