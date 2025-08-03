import { Redirect } from "react-router-dom";
import {API_ROUTE} from "../data/Config"
import {serializeJSON} from '../helper/Funcs';
import { getToken,setCurrentScreen,setUser } from "../session/Control";

export const  getUserData = async() => {
    const URL = API_ROUTE.GET_USER;
    let data = {};
    console.log("Call getUserData");
    const reqOptions = {
        method: "POST",
        //headers: {'Content-Type': 'application/json'},
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Authorization" :"Bearer " + getToken()
        },
        //body: JSON.stringify({mobile_no:mobile_no,otp:enter_otp,token:token})
        //body: serializeJSON({access_token:getLocalToken()})
      }

    return data = await fetch(URL,reqOptions)
        .then(response => response.json())

        .then((data)=>{

              setCurrentScreen(data.current_screen);
              setUser(data.user);
              console.log("Fetch Done::",data);
              
              return data;

            // if(data.access_token && data.access_token!='null'){
              
            //   setCurrentScreen(data.current_screen);
            //   setUser(data.user);
            //   console.log("Fetch Done::",data);
              
            //   //setUser(data.user);
            //   return data;
            // }else{
            //   return null;
            // }
        } 
        );
};

export const  getKYCData = async() => {
  const URL = API_ROUTE.GET_KYC;
  let data = {};
  
  const reqOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Authorization" :"Bearer " + getToken()
      },
      //body: serializeJSON({access_token:getLocalToken()})
    }

  return data = await fetch(URL,reqOptions)
      .then(response => response.json())
      .then((data)=>{
          
        return data;

          // if(data.access_token && data.access_token!='null'){
          //   return data;
          // }else{
          //   return null;
          // }
      } 
      );
};