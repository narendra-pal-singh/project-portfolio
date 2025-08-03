import React, { Component, } from 'react'
import ReactDOM from 'react-dom';
import { API_ROUTE,CS_ROUTE } from "../data/Config"
import { serializeJSON } from '../helper/Funcs';
import {getUserData}  from "../services/UserAPI";
import { getLocalToken, setPIN, setUnLockAPP, setForgotPIN, isPINSet,setUserSession,setCurrentScreen } from "../session/Control";

export default class UnlockApp extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isLoaded: false,
      errorMsg: "",
      //unlock_pin: [{value:"",ref:null}],
      unlock_pin: ["", "", "", ""]
    }
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  //addClick = ()=>{
  //this.setState(prevState => ({errorMsg:"test", unlock_pin: [...prevState.unlock_pin, '']}))
  //this.setState({errorMsg:"test"});
  //}

  componentDidMount() {

    // if(isForgotPIN()!=="true" && isPINSet() === "true" && isUnLockAPP() !== "true" && current_path !== '/unlock_app' ){
    //   this.redirect('/unlock_app');
    // }
    
    if(getLocalToken() === null || getLocalToken() === "" || isPINSet() !== 'true' ){
      //alert("home");
      this.props.history.push('/');
    }

    ReactDOM.findDOMNode(this.refs['input_0'] ).focus();
    
  }

  handleKeyPress({ nativeEvent: { key: keyValue } }) {
    console.log("handleKeyPress",this.state.unlock_pin);
    if (keyValue === 'Backspace') {
        this.refs.refOfPreviousInput.focus();
    }
}

  handleChange = (i, event) => {
    //handleChange = input => e =>{
    console.log("handleChange",this.state.unlock_pin);

    let unlock_pin = [...this.state.unlock_pin];
    unlock_pin[i] = event.target.value;
    
    const focusIndex = i+1;
    if(focusIndex<unlock_pin.length && event.target.value!=="")
      ReactDOM.findDOMNode(this.refs['input_'+focusIndex] ).focus();
    
    this.setState({ unlock_pin });

    
  }

  onKeyDown = (e)=>{
    
    console.log("onKeyDown",this.state.unlock_pin);

    if(e.keyCode ===13 && e.target.id === 'input-3'){
      //console.log("unlock now",);
      this.unLockScreen();
    }

    if(e.keyCode ===8 && e.target.value==""){
      const inputs = this.state.unlock_pin;
      for(var key in inputs){
        if(inputs[key]===""){
          if(key>0){
            ReactDOM.findDOMNode(this.refs['input_'+(key-1)] ).focus();
          }
          break;
        }
      }
     //ReactDOM.findDOMNode(this.refs['input_2'] ).focus();
    }
    
  }

  inputFocus = (el,i)=>{
    
    console.log("input i=",i);
    console.log("input el=",el);
  }


  // handleChange = input => e => {
  //   e.preventDefault();

  //   this.setState({
  //     [input]: e.target.value,
  //     errorMsg: "",
  //   });
  // }

  unLockScreen = () => {

    //alert(this.state.unlock_pin.join('')); return;
    const unlock_pin = this.state.unlock_pin.join('');
    
    

    //Verify PIN No as well as Get User user data
    if (unlock_pin.length === 4) {

      this.setState({ isLoaded: true });

      const reqOptions = {
        method: "POST",
        //headers: {'Content-Type': 'application/json'},
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Authorization" :"Bearer " + getLocalToken()
        },
        //body: JSON.stringify({mobile_no:mobile_no,otp:enter_otp,token:token})
        body: serializeJSON({ pin_no: unlock_pin })
      }

      fetch(API_ROUTE.VERIFY_PIN, reqOptions)
        //.then(response => response.json())
        .then(response => {
          if (response.ok) return response.json();
          return response.json().then(response => {
            const error = response.message?response.message:"Server Issue, Please try later";
            throw new Error(error)
          })
        })
        .then(async data => {

          console.log("VERIFY_PIN RES=", data);

          const { status, message , access_token} = data;

          //if (status === true) {

            if (access_token !== "") {

              setUnLockAPP(true);
              setPIN(true);

              if(data.user){
                
                 
                const user = data.user;

                setCurrentScreen(user.current_screen);
                setUserSession(access_token, user ); 

                //alert(user.current_screen);
                //this.props.history.push(CS_ROUTE[user.current_screen]);
                this.props.history.push(CS_ROUTE['dashboard']);

              }else{
                  this.props.history.push(CS_ROUTE['home']);
              }
              
              // getUserData().then(rData=>{
              //   if(rData.user){
              //     setCurrentScreen(rData.current_screen);
              //     setUserSession(access_token, rData.user ); 
              //     this.props.history.push(CS_ROUTE[rData.current_screen]);
              //   }else{
              //     //clear localstore
              //     this.props.history.push(CS_ROUTE['home']);
              //   }
              // });

              //setUserSession(access_token, '{"id":"1","first_name":""}' ); 

              //this.props.history.push('/basic_info');
              //this.props.history.push(CS_ROUTE[data.current_screen]);
              

            } else {
              //New User
              this.props.redirectPage("/login");

            }
          
          // } else {
          //   //ReactDOM.findDOMNode(this.refs['input_0'] ).focus();
          //   this.setState({unlock_pin:["", "", "", ""],errorMsg: message, isLoaded: false});
          // }

          //this.setState({errorMsg:'OTP Generating Error, Please resend OTP again.',isLoaded:false});
          //this.props.history.push('/login');

        })
        .catch(error => {
          this.setState({unlock_pin:["", "", "", ""],errorMsg: error.toString(), isLoaded: false});
          //this.setState({errorMsg:error.toString(),isLoaded:false});
          console.log("ERROR::VERIFY_PIN RES=",error);
        });

    } else {
      this.setState({ errorMsg: "Invalid PIN, Please enter 4 digit PIN." });
    }
  }


  forgotPIN = () => {
    //localStorage.clear();sessionStorage.clear();
    setForgotPIN(true);
    this.props.history.push('/login');
  }

  _forgotPIN = () => {

    const token = getLocalToken();

    //Call API for Save PIN then call this
    const reqOptions = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token })
    }

    fetch(API_ROUTE.FORGOT_PIN, reqOptions)
      .then(response => response.json())
      .then(async response => {

        console.log("GET DATA=", response);

        const { status, access_token, message, mobile_no } = response;

        if (status === true && access_token !== "") {

          //setPIN(true); setUnLockAPP(false);
          //this.props.redirectPage('/unlock_app');

        } else {

          this.setState({ errorMsg: message, isLoaded: false });
          //this.props.redirectPage('/login');
        }
      })
      .catch(error => {
        // this.setState({errorMsg:error.toString(),isLoaded:false});
        console.log("ERROR::GET OTP=", error);
      });

  }

  PinBoxUI = () => {

    //console.log("PINBOX", this.state.unlock_pin);

    return this.state.unlock_pin.map((el, i) =>
      <div key={i} className="col-3">
        <input type="password" ref={"input_"+i}  inputMode="numeric" maxLength="1" className={"form-control form_input input_"+i} value={el || ''} onChange={this.handleChange.bind(this, i)} onKeyDown={this.onKeyDown} id={"input-"+i} onKeyPress={ this.handleKeyPress }/>
      </div>
    )
  }

  render() {

    const { isLoaded, errorMsg } = this.state;

    if (isLoaded) {
      return <Loading />;
    } else {

      return (
        <div className="btmContent">
          <p className="head_text">
            Enter 4-digit PIN Number for Unlock Screen
          </p>
          <div className="input_div">
            <div className="row pinBox">

              {this.PinBoxUI()}
            
              {/* { <div className="col-3">
<input type="password" maxLength="4" ref="myinput" className="form-control form_input" />
</div> } */}



            </div>
            <div className={"error " + (errorMsg !== "" ? " show " : "")}>{errorMsg}</div>
            <p>
              Forgot PIN? <a href="#" onClick={this.forgotPIN}>Click Here</a>
            </p>
          </div>
          <p>
            <button type="button" className="btn app_btn" onClick={this.unLockScreen}>
              Submit
            </button>
          </p>
        </div>
      )
    }
  }
}

const Loading = (props) => (
  <div>Loading... </div>
)