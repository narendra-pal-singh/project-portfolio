import React, { Component } from 'react'
import { serializeJSON } from '../../../helper/Funcs';
import { getUserData } from "../../../services/UserAPI";
import { API_ROUTE, CS_ROUTE } from "../../../data/Config"
import { getToken, getUser, setUser, isUnLockAPP, setCurrentScreen } from '../../../session/Control';
export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      errorMsg: "",
      userData: null,

    }
    var wc_screen = null
  }
  componentDidMount() {
    console.log("Dashboard componentDidMount");
    getUserData().then(rData => {
      if (rData != null && rData) {
        setUser(rData);
        this.setState({ userData: rData });

        this.wc_screen = setInterval(this.confirmUser, 2000);
      } else {
        //if user data not getting then it's mean user not register then relogin
        this.props.history.push(CS_ROUTE['get_otp']);
      }
    });
  }
  confirmUser = () => {
    const { userData } = this.state;
    if (!userData) {

      this.setState({ errorMsg: 'User data not found..' });

    } else {

      const token = getToken();

      const reqOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Authorization": "Bearer " + getToken()
        },
        body: serializeJSON({ confirm_data: "1" })
      }
      fetch(API_ROUTE.confirmData, reqOptions)
        //.then(response => response.json())
        .then(response => {
          if (response.ok) return response.json();
          return response.json().then(response => {
            const error = response.message ? response.message : "Server Issue, Please try later";
            throw new Error(error)
          })
        })
        .then(async data => {

          clearInterval(this.wc_screen);
          this.props.redirectPage(CS_ROUTE['dashboard']);
        })
        .catch(error => {
          this.setState({ errorMsg: error.toString(), isLoaded: false });
          console.log("ERROR::GET OTP=", error);
        });
    }
  }
  render() {
    const { userData } = this.state;
    return (
      <div className="row get_srtted_row">
        <div className="container">
          <div className="col-lg-12 pd_lft_rt">
            <center>
              <img src="/images/welcome_logo.png" alt="payed" className="img-fluid logo_wdth" />
              <p className="welcom_msg">Welcome {userData ? userData.first_name : null} !</p>
              {/* <p className="welcom_msg">DOB - 15-09-1990</p>
                <p className="welcom_msg">Gender - Male</p>
                <p className="welcom_msg">Company Name - XYZ Pvt Ltd</p> */}
              {/* <p><button className="btn app_btn app_btn_continue">Continue</button></p> */}
            </center>
          </div>
        </div>
      </div>
    )
  }
}
