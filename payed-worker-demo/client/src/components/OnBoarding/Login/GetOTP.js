import React, { Component } from 'react'
import { Redirect } from 'react-router';
import Axios from 'axios';
import {serializeJSON} from '../../../helper/Funcs';
import { API_ROUTE } from "../../../data/Config"
import { getLocalToken, getToken, isForgotPIN } from '../../../session/Control';
export default class GetOTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: true,
      errorMsg: ""
    }
    this.mobileRef = React.createRef();
  }
  componentDidMount() {
      //this.fetchPost();
      
      // if(getToken()!==null && getToken() !== ""){
      //   this.props.redirectPage("/");
      // }
      console.log("REF",this.mobileRef.current);
  }
  onKeyUp = (event) => {
    
    //event.preventDefault();
    //console.log("onKeyup",event.charCode);
    this.setState({ errorMsg: "" });
    //alert("enter=",event.charCode);
    if (event.charCode === 13) {
      
      //alert("enter");
      //console.log("REF",this.mobileRef.current);
      this.getOTP(event);
    }
  }
  getOTP = (e) => {
    e.preventDefault();
    //this.props.redirectPage("/login/thankyou");return;
    const mobile_no = this.props.data.mobile_no;
    
    var pattern = new RegExp(/^[0-9\b]+$/);
    this.mobileRef.current.focus();
    if (mobile_no.length === 0) {
      this.setState({ errorMsg: "Mobile number must be enter." });
    } else if (!pattern.test(mobile_no)) {
      this.setState({ errorMsg: "Please enter only number." });
    } else if (mobile_no.length < 10) {
      this.setState({ errorMsg: "Please enter valid phone number." });
    } else {
      this.setState({ isLoaded: false });
      var postData = { mobile_no: mobile_no };
      if(isForgotPIN() === "true")
        postData.token = getLocalToken();
      console.log('postData = ',postData);
      const reqOptions = {
        method: "POST",
        //headers: { 'Content-Type': 'application/json' },
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        //body: JSON.stringify({ mobile_no: mobile_no })
        body: serializeJSON(postData)
      }
      fetch(API_ROUTE.GET_OTP, reqOptions)
        //.then(response => response.json())
        // .then(response => {
        //   if (!response.ok) {
        //     console.log("+",response,"+");
        //     return Promise.reject(response.statusText);
        //   }else{
        //     console.log(response, "the user service response was gooooooooooood");
        //   }
        //   return response.json();
        // })
        .then(response => {
          if (response.ok) return response.json();
          console.log("RES=", response);
          
          return response.json().then(response => {
            console.log("BODY RES=", response);
            const error = response.message?response.message:"Server Issue, Please try later";
            throw error;
          })
        })
        .then(async data => { //return data from response 
          console.log("GET OTP RES=", data);
          
          if (data.token!==undefined && data.token!=="") {
            this.props.receivedOTPData(data);
            this.props.redirectPage("/login/verify");
          } else {
            this.setState({ errorMsg: 'OTP Generating Error, Please GET OTP again.', isLoaded: true });
            //this.props.history.push('/login');
          }
        })
        .catch(error => {
          this.setState({ errorMsg: error.toString(), isLoaded: true });
          console.log("ERROR::GET OTP=", error);
        });
    }
  }
  render() {
    console.log("GETOTP Props", this.props);
    const { isLoaded, errorMsg } = this.state;
    return (
      <div className="btmContent">
        {/* <BarLoader color="#1D8BF1" height="2" /> */}
        <p className="head_text">
         Enter mobile number to get OTP
        </p>
        <div className="input_div">
          <input
            type="tel"
            autoFocus
            maxLength="10"
            ref={this.mobileRef}
            value={this.props.data.mobile_no}
            placeholder="Enter Mobile Number"
            className="form-control form_input"
            onChange={this.props.handleChange('mobile_no')}
            onKeyPress={this.onKeyUp}
          />
        </div>
        <div className={"error " + (errorMsg !== "" ? " show " : "")}>{errorMsg}</div>
        <p>
          <button className="btn app_btn" onClick={this.getOTP}>Get OTP</button>
        </p>
      </div>
    )
  }
}
// const Loading = (props) => (
//   <div>Loading... </div>
// )