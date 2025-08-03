import React, { Component } from 'react'
import { Redirect } from "react-router";

import {serializeJSON} from '../../helper/Funcs';
import { getToken } from "../../session/Control";
import {API_ROUTE,CS_ROUTE} from "../../data/Config"

export default class TNC extends Component {

  constructor(props){
    super(props);
    this.state = {
      acceptTnc:true,
      tncContent : {
        id:0,
        content:"",
      }
    }
  }

  handleChange = input => e =>{
    
    if(e.target.type === 'checkbox'){
      this.setState({[input]:e.target.checked,errorMsg: ""});
    }else{
      e.preventDefault();
      //   this.setState({[input]:e.target.value,errorMsg: "",inputState:{blankValue:e.target.value}});
    }
    
  }

  componentDidMount(){
    //console.log("componentDidMount"); 
    this.getTncContent();
  }

  componentDidUpdate(){
    console.log("componentDidUpdate"); 
  }

  getTncContent = async() =>{

    //if(this.state.tncContent.content === "" && this.state.tncContent.fetch === false)
    if(this.state.tncContent.content === ""){

      //this.setState({isLoaded: true,tncContent:{fetch:true}});

      const reqOptions = {
        method: "POST",
        //headers: {'Content-Type': 'application/json'},
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Authorization" :"Bearer " + getToken()
        },
        //body: JSON.stringify({mobile_no:mobile_no,otp:enter_otp,token:token})
        body: serializeJSON({page:'tnc'})
      }
      
      fetch(API_ROUTE.TNC,reqOptions)
        .then(res => res.json())
        .then(result => {
          
          console.log('TNC',result);

          if(result.raw_contents !== undefined && result.raw_contents !== ""){
            this.setState({
              isLoaded: false,
              tncContent:{id:result.id, content:result.raw_contents}
            });
          }else{
            this.setState({errorMsg:'Can not fetch TnC, please try again',tncContent:{content:"No Content Found"},isLoaded:false});  
        }
      }).catch(error =>{
        console.log("ERRROR",error);
        this.setState({errorMsg:error.toString(),tncContent:{content:"No Content Found"},isLoaded:false});
      });
    }
  }

  acceptTnc = (e) => {
    
    //e.preventDefault();
    //console.log('acceptTnc=',this.state.acceptTnc);

    if(this.state.acceptTnc === false){
      
      this.setState({errorMsg:'Please accept Term & Condition for proceed.'});

    }else{

      const {tncContent,acceptTnc} = this.state;



      const token = getToken();
      
      //Call API for Save PIN then call this
      const reqOptions = {
        method: "POST",
        //headers: {'Content-Type': 'application/json'},
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Authorization" :"Bearer " + getToken()
        },
        //body: JSON.stringify({access_token:token,pin_no:pin_no})
        body: serializeJSON({id:tncContent.id,accept_tnc:acceptTnc})
      }

      fetch(API_ROUTE.AcceptTNC, reqOptions)
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

            this.props.redirectPage(CS_ROUTE['set_pin']);
              
          })
          .catch(error => {
            this.setState({errorMsg:error.toString(),isLoaded:false});
            console.log("ERROR::GET OTP=",error);
          });
      
      //this.props.redirectPage("/login/lang_choose");
      // this.props.history.push('/login/lang_choose');
      
    }
  }


  render() {

    //if( getToken() === null){ return( <div><Redirect to="/" /></div> ) }

    const {isLoaded,errorMsg,tncContent,acceptTnc} = this.state;
  
  if(isLoaded){
    return <Loading/>;
   } else {
  
  return(
  <div className="btmContent">
    <p className="head_text">
      <strong>Terms and Conditions</strong>
    </p>
    <div className="input_div">
      <p style={{textAlign:'justify'}}>
        {tncContent.content}
      </p>
    </div>
    <label className="lbl_container">
      <input type="checkbox" defaultChecked={acceptTnc} onChange={this.handleChange('acceptTnc')} />
      <span className="checkmark"></span> I agree to all the{" "}
      <span>Terms and Conditions</span>
    </label>
    <div className={"error "+(errorMsg!==""?" show ":"") }>{errorMsg}</div>
    <p>
      <button className="btn app_btn" onClick={this.acceptTnc}>Agree</button>
    </p>
  </div>
  )
   }
    }
}
const Loading = (props) => (
  <div>Loading... </div>
)