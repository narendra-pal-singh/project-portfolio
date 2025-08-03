import React, { Component } from 'react'
import { Redirect } from 'react-router';
import Axios from 'axios';
import { setLocalToken, getToken, isPINSet, isForgotPIN, setUserSession, isUnLockAPP, setPIN, isOTPVerify } from "../../../session/Control";
import { API_ROUTE, CS_ROUTE, CONFIG } from "../../../data/Config"
import { serializeJSON } from '../../../helper/Funcs';
export default class VerifyOTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      errorMsg: "",
      enter_otp: "",
      Timer: CONFIG.OTP_TIMER,
      startTimer: null
    }
    this.startTimer = null
  }
  componentDidMount() {
    this.startTime();
  }
  startTime = () => {
    this.setState({
      Timer: CONFIG.OTP_TIMER,
    });
    this.startTimer = setInterval(this.countDown, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.startTimer);
  }

  countDown = () => {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.Timer - 1;
    //console.log("TIMER",seconds);
    this.setState({
      Timer: seconds,
    });

    // Check if we're at zero.
    if (seconds == 0) {
      clearInterval(this.startTimer);
    }
  }
  handleChange = input => e => {
    e.preventDefault();
    this.setState({ [input]: e.target.value, errorMsg: "" });
  }
  verifyOTP = async (e) => {
    e.preventDefault();
    const enter_otp = this.state.enter_otp;

    //Data coming from parent class
    const mobile_no = this.props.data.mobile_no;
    const token = this.props.data.token;
    if (enter_otp !== "" && enter_otp.length === 6) {
      //this.setState({ isLoaded: true });
      const reqOptions = {
        method: "POST",
        //headers: {'Content-Type': 'application/json'},
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        //body: JSON.stringify({mobile_no:mobile_no,otp:enter_otp,token:token})
        body: serializeJSON({ otp: enter_otp, otp_token: token, mobile_no: mobile_no })
      }
      fetch(API_ROUTE.VERIFY_OTP, reqOptions)
        //.then(response => response.json())
        .then(response => {
          if (response.ok) return response.json();

          console.log("RES=", response);

          return response.json().then(response => {
            console.log("BODY RES=", response);
            const error = response.message ? response.message : "Server Issue, Please try later";
            throw new Error(error)
          })

        })
        .then(async response => {

          console.log("Verify RES DATA=", response);

          const { login_token, access_token, message, user, guest } = response;

          if (access_token !== "" && user !== undefined && user !== "" && user !== null) {

            setLocalToken(login_token);  //set login token only
            setUserSession(access_token, user);

            //alert(CS_ROUTE[response.current_screen]);
            if (user.accept_tnc == null) {

              this.props.redirectPage(CS_ROUTE['tnc']);
            } else if (isForgotPIN() === "true" || user.pin_no == null || user.pin_no == 0) {
              this.props.redirectPage('/login/set_pin');
            } else if (isUnLockAPP() !== "true") {
              setPIN(true);
              this.props.redirectPage(CS_ROUTE['unlock_app']);
            } else if (isOTPVerify() !== "") {
              //this function define in dashboard
              this.props.sendWithdrawRequest();
              this.props.redirectPage(isOTPVerify());
              //return;
            } else {
              // console.log('Current Screen',user.current_screen);
              this.props.redirectPage(CS_ROUTE[user.current_screen]);
            }
          } else {

            localStorage.clear(); sessionStorage.clear();
            if (guest) {
              this.props.redirectPage(CS_ROUTE['thankyou']);
            } else {
              console.log("SIGUP");
              //New User
              this.props.redirectPage(CS_ROUTE['signup']);
            }


          }

          //this.setState({errorMsg:'OTP Generating Error, Please resend OTP again.',isLoaded:false});
          //this.props.history.push('/login');

        })
        .catch(error => {
          this.setState({ errorMsg: error.toString(), isLoaded: false });
          console.log("ERROR::Verify RES=", error);
        });
    } else {
      this.setState({ errorMsg: 'Invalid OTP, please enter valid OTP', isLoaded: false });
    }
  }
  resendOTP = () => {
    const mobile_no = this.props.data.mobile_no;
    const token = this.props.data.token;
    if (mobile_no !== "") {
      this.setState({ isLoaded: true, Timer: CONFIG.OTP_TIMER, errorMsg: "" });
      const reqOptions = {
        method: "POST",
        //headers: { 'Content-Type': 'application/json' },
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        //body: JSON.stringify({ mobile_no: mobile_no })
        body: serializeJSON({ mobile_no: mobile_no })
      }
      fetch(API_ROUTE.GET_OTP, reqOptions)
        .then(response => response.json())
        .then(async response => {
          //const isJson = response.headers.get('content-type')?.includes('application/json');
          //const data = isJson && await response.json();
          // if(!response.ok){
          //   //alert('not okay');
          //   this.setState({errorMsg:'Network Error, Please try again.',isLoaded:false});
          //   const error = (data && data.message) || response.status;
          //   return Promise.reject(error);
          // }
          console.log("GET DATA=", response);
          //All Okay and get OTP then redirect verify 
          if (response.token !== undefined && response.token !== "") {
            this.setState({ isLoaded: false });
            this.props.receivedOTPData(response);
            this.startTime();

          } else {
            this.setState({ errorMsg: 'OTP Generating Error, Please resend OTP again.', isLoaded: false });
            //this.props.history.push('/login');
          }
        })
        .catch(error => {
          this.setState({ errorMsg: error.toString(), isLoaded: false });
          console.log("ERROR::GET OTP=", error);
        });
    } else {
      //redirect get otp page
    }
  }
  render(props) {
    const { isLoaded, errorMsg, enter_otp, Timer } = this.state;
    const { mobile_no, token } = this.props.data;
    if (token === "")
      return <Redirect to="/login" />
    if (isLoaded) {
      return <Loading />;
    } else {
      return (
        <div className="btmContent">
          <p className="head_text">
            Enter 4-digit OTP sent to your mobile number
          </p>
          <div className="input_div">

            <input
              type="tel"
              autoFocus
              maxLength="6"
              className="form-control form_input"
              placeholder="Enter OTP"
              onChange={this.handleChange('enter_otp')}
            />
            <div className={"error " + (errorMsg !== "" ? " show " : "")}>{errorMsg}</div>
            {
              Timer === 0 ?
                <div>
                  <p>Didn't receive the verification OTP?</p>
                  <p>
                    <a href="#" onClick={this.resendOTP}>Resend again</a>
                  </p>
                </div>
                :
                <p>The OTP will expire in {Timer} seconds</p>
            }


          </div>
          <p>
            <button className="btn app_btn" onClick={this.verifyOTP}>Verify</button>
          </p>
        </div>
      )
    }
  }
}
const Loading = (props) => (
  <div>Loading... </div>
)