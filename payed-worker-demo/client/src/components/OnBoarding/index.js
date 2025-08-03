import React, { Component } from "react";
import { isPINSet, isUnLockAPP, getLocalToken,getCurrentScreen, setCurrentScreen, isForgotPIN } from "../../session/Control";
import  {GetOTP, VerifyOTP, Signup } from "./Login";
import TnC from "./TNC";
import SetPIN from "./SetPIN";
import Welcome from "./Login/Welcome";
//import Language from "./Language";
import ThankYou from "./Login/ThankYou";
const initialState = {
  mobile_no : "",
  enter_otp: "",
  hash: "",
  token: "",
  current_path:null,
  redirect:""
};
export default class index extends Component {
  constructor(props){
    super(props);
    this.state = initialState;
  }
  handleChange = input => e =>{
    e.preventDefault();
    // console.log('handleChangeType=',e.target.type)
    // console.log('handleChangeValue=',e.target.value)
    if(e.target.type === 'checkbox')
      this.setState({[input]:e.target.checked,errorMsg: ""});
    else
      this.setState({[input]:e.target.value,errorMsg: "",inputState:{blankValue:e.target.value}});
  }
  handleRedirect = (path) => {
    //this.setState({redirect:path});
    console.log("REDIRECT",path);
    setCurrentScreen(path);
    this.props.history.push(path);
  }
  receivedOTPData = (data) => {
    this.setState({token:data.token});
  }
  // resetState = () => {
  //   this.setState(initialState);
  // }
  componentDidMount(){
    this.isLogged();
  }
  componentDidUpdate(){
    //alert(this.props.location.pathname);
    
  }
  isLogged(){
    
    
    const current_path = this.props.location.pathname;
    if(getLocalToken() !== null){
      if(isForgotPIN()!=="true" && isPINSet() === "true" && isUnLockAPP() !== "true" && current_path !== '/unlock_app' ){
          
          this.handleRedirect('/unlock_app');
      }else{
        //redirect user current screen
        if(getCurrentScreen()==null){
          //Call API can get current screen
        }
        //alert("current screen=="+getCurrentScreen());
        //this.handleRedirect(getCurrentScreen());
      }
    }else{
      
        if(current_path !== '/' && current_path!="/login" )
            this.handleRedirect('/');
    }
    
  }
  // redirect = (path) =>{
    
  //   if(path !=null)
  //     this.props.history.push(path);
  //   else{
  //       //this.props.history.push('/');
  //   } 
      
  // }
  randerPage(){
    
  switch(this.props.location.pathname){
    
    case '/login':
      return <GetOTP  data={this.state} handleChange={this.handleChange} redirectPage={this.handleRedirect} receivedOTPData={this.receivedOTPData} />;
    case '/login/verify':
      return <VerifyOTP  data={this.state} handleChange={this.handleChange} redirectPage={this.handleRedirect} receivedOTPData={this.receivedOTPData}/>;
    case '/login/signup':
      return <Signup  data={this.state} handleChange={this.handleChange} redirectPage={this.handleRedirect} />;
    case '/login/thankyou':
        return <ThankYou data={this.state} redirectPage={this.handleRedirect} />;
    case '/login/tnc':
      return <TnC data={this.state} handleChange={this.handleChange}  redirectPage={this.handleRedirect} />;
    case '/login/set_pin':
        return <SetPIN data={this.state} handleChange={this.handleChange} redirectPage={this.handleRedirect} />;
    case '/login/welcome':
          return <Welcome data={this.state} handleChange={this.handleChange} redirectPage={this.handleRedirect} />;
    // case '/login/language':
    //   return <Language data={this.state} handleChange={this.handleChange} redirectPage={this.handleRedirect} />;
    default:
      return <div>Page Not Found</div>
  }
  }
  render() {
    console.log('OnBoarding',this.props);
    return (
        <div>
          {this.randerPage()}
        </div>
    )
    
  }
}
