import React from "react";
import { Component } from "react";
import { Link } from "react-router-dom";

import { CS_ROUTE } from "../data/Config"
import { getUser, isPINSet, isUnLockAPP, isForgotPIN, getLocalToken, getCurrentScreen } from "../session/Control";
import { getUserData } from "../services/UserAPI";

// import step_1_img from "../assets/images/wtch_img.jpg";
// import step_2_img from "../assets/images/ernd_img.jpg";
// import step_3_img from "../assets/images/no_itrst_img.jpg";
// import wh_now_logo from "../assets/images/wh_now_logo.jpg";


import './SplashScreen.css';

export default class SplashScreen extends Component {

  constructor(props) {

    super(props);

    this.state = {
      step: 1
    }
  }

  componentDidMount() {

    if (getLocalToken() !== null && getLocalToken() !== "") {

      const current_path = this.props.location.pathname;

      //alert(current_path);

      //If token exists and setpin not set then page will go on SetPin
      if (isForgotPIN() !== "true" && isPINSet() === "true" && isUnLockAPP() !== "true" && current_path !== '/unlock_app') {

        this.redirect('/unlock_app');

      } else {

        const userData = getUser();
        //console.log("UserData=", userData);
        if (userData && userData.current_screen !== "") {
          this.redirect(CS_ROUTE[userData.current_screen]);
        }
        //alert(getCurrentScreen());
        //this.redirect(getCurrentScreen());
        // console.log("SPLAshScreen Redirec",CS_ROUTE[getCurrentScreen()]);
        // alert(CS_ROUTE[getCurrentScreen()]);

        // if(CS_ROUTE[getCurrentScreen()])
        //   this.redirect(CS_ROUTE[getCurrentScreen()]);
      }
    } else {

      //set isLoaded false
    }

  }


  goStep = (step) => {
    
    this.setState({
      step: step
    })
  }

  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    })
  }

  preStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    })
  }

  lastStep = () => {
    const { step } = this.state;
    this.setState({
      step: 3
    })
  }

  handleChange = input => e => {
    this.setState({ [input]: e.target.value })
  }

  redirect = (path) => {
console.log("path=",path);
    if (path != null)
      this.props.history.push(path);
    else
      this.props.history.push('/');
  }

  render() {
    const { step } = this.state;

    switch (step) {
      case 1:
        return (
          <>
            <center>

              <p className="head_text head_text_onboard">
                Why wait for month end to, <br /> access salary earned today?
              </p>

              <img src='/images/wtch_img.jpg' alt="appman" className="img-fluid onboard_img" />

              <SplashControl step={this.state.step} goStep={this.goStep}/>


              <p className="head_textboard poweredBy">Powered by</p>
              <img src="images/wh_now_logo.jpg" alt="wh logo" className="img-fluid onboard_last_img" />
              <p className="head_textboard">Made in India</p>
            </center>

            <SplashNext nextStep={this.nextStep} lastStep={this.lastStep} />

          </>
        )
      case 2:
        return (
          <div>
            <center>
              <p className="head_text head_text_onboard">
                Your earned salary is a click away
              </p>
              <img src="images/ernd_img.jpg" alt="appman" className="img-fluid onboard_img" />

              <SplashControl step={this.state.step} goStep={this.goStep}/>

              <p className="head_textboard poweredBy">Powered by</p>
              <img src="images/wh_now_logo.jpg" alt="wh logo" className="img-fluid onboard_last_img" />
              <p className="head_textboard">Made in India</p>
            </center>
            <SplashNext nextStep={this.nextStep} lastStep={this.lastStep} />
          </div>
        )
      case 3:
        return (
          <div>
            <center>
              <p className="head_text head_text_onboard">
                No interest, no hidden charges
              </p>
              <img src="images/no_itrst_img.jpg" alt="appman" className="img-fluid onboard_img" />

              <SplashControl step={this.state.step} goStep={this.goStep}/>

              <p>
                <Link to="/login">
                  <button className="btn app_btn app_btn_onboard">GET Started</button>
                </Link>
              </p>
              <p className="head_textboard poweredBy">Powered by</p>
              <img src="images/wh_now_logo.jpg" alt="wh logo" className="img-fluid onboard_last_img" />
              <p className="head_textboard">Made in India</p>
            </center>
          </div>
        )
    }


  }

}


const SplashControl = (props) => {

  const step = props.step;

  return (
    <div className="slide_screen">
      <div className="col-lg-12 slide_div pd_lft_rt">
        <span onClick={(e)=> props.goStep(1) } className={(step==1)?"active":""}></span>
        <span onClick={(e)=> props.goStep(2) } className={(step==2)?"active":""}></span>
        <span onClick={(e)=> props.goStep(3) } className={(step==3)?"active":""}></span>
      </div>
    </div>
  )
}

const SplashNext = (props) => {

  return (
    <div className="col-lg-12 pd_lft_rt">
      <p className="nxt_cls">
        <span onClick={props.lastStep}>Skip</span>
        <span className="next_span" onClick={props.nextStep}>Next</span>
      </p>
    </div>
  )
}
