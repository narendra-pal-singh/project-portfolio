import React, { Component } from 'react'
import {getUserData}  from "../../services/UserAPI";
import { API_ROUTE,CS_ROUTE } from "../../data/Config"
import {serializeJSON} from '../../helper/Funcs';
import { setPIN,setUnLockAPP, setForgotPIN, getToken,setUserSession } from "../../session/Control";
export default class SetPIN extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoaded: false,
      errorMsg: "",
      //Set PIN Screen Variables
      setPinNo : "",
      confirmPinNo: "",
    }
  }
  handleChange = input => e =>{
    e.preventDefault();
    this.setState({[input]:e.target.value,errorMsg: ""});
  }
  setPIN = (e) => {
    
    //this.setState({inpu});
    e.preventDefault();
    if(this.state.setPinNo === this.state.confirmPinNo){
      const pin_no = this.state.setPinNo;
      
      //Call API for Save PIN then call this
      const reqOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Authorization" :"Bearer " + getToken()
        },
        body: serializeJSON({pin_no:pin_no})
      }
      fetch(API_ROUTE.SAVE_PIN, reqOptions)
          //.then(response => response.json())
          .then(response => {
            if (response.ok) return response.json();
            return response.json().then(response => {
              const error = response.message?response.message:"Server Issue, Please try later";
              throw new Error(error)
            })
          })
          .then(async data =>{
            console.log("GET DATA=",data);
            //const { status, access_token, message } = data;
            const { message,user } = data;
            //if(status === true && access_token !== "") {
              setPIN(true);setUnLockAPP(true);setForgotPIN(false);
              setUserSession(null,user); 
              //getUserData();
              //setUserSession(access_token, '{"id":"1","first_name":""}' ); 
              if(user.current_screen !== null && user.current_screen !=='set_pin')
                this.props.redirectPage(CS_ROUTE[user.current_screen]);
              else if(user.current_screen =='set_pin'){
                this.props.redirectPage('/login/welcome'); 
              }
              else
                this.props.redirectPage('/login/tnc');
              
            // }else{
            //   this.setState({errorMsg:message, isLoaded:false});
            //   //this.props.redirectPage('/login');
            // }
          })
          .catch(error => {
            this.setState({errorMsg:error.toString(),isLoaded:false});
            console.log("ERROR::SET PIN=",error);
          });
      
      
    }else{  
      //this.setState({inputState:{type:'password'}});
      // this.setState({inputState:{readOnly:false}});
      this.setState({errorMsg:'Confirm PIN not matching'});
    }
    
  }
  render() {
    // if( getToken() === null){ return( <div><Redirect to="/" /></div> ) }
    const {isLoaded,errorMsg} = this.state;
    const {setPinNo,confirmPinNo} = this.state;
    //const {value} = {setPinNo}
  if(isLoaded){
    return <Loading/>;
  
  } else {
  return(
  <div className="btmContent">
    <p className="head_text">
      <strong>Set your PIN</strong><br/>
    </p>
    <div className="input_div">
      <input
        type="password"
        inputmode="numeric"
        pattern="[0-9]*"
        maxLength="4"
        className="form-control form_input"
        placeholder="Enter PIN"
        onChange={this.handleChange('setPinNo')}
      />
      <input
        type="password"
        inputmode="numeric"
        pattern="[0-9]*"
        maxLength="4"
        className="form-control form_input"
        placeholder="Confirm PIN"
        onChange={this.handleChange('confirmPinNo')}
      />
      <div className={"error "+(errorMsg!==""?" show ":"") }>{errorMsg}</div>
      
    </div>
    <p>
      <button type="button" className="btn app_btn" onClick={this.setPIN}>
        Submit
      </button>
      
    </p>
  </div>
)}
    }
}
const Loading = (props) => (
  <div>Loading... </div>
)