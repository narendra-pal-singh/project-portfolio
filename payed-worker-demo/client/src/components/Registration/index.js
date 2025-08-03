import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import Selfie from "./Selfie";
import {getUserData}  from "../../services/UserAPI";
import { getLocalToken, getToken,getUser,setUser,setCurrentScreen } from "../../session/Control";
import { pagesData } from '../../data/AppData';
import {serializeJSON} from '../../helper/Funcs';
import {API_ROUTE,CS_ROUTE} from "../../data/Config"

export default class index extends Component {

  constructor(props) {
    super(props);

    this.state = {
      errorMsg: "",
      first_name: '',
      last_name: '',
      dob: '',
      gender: 'm'
    };
  }

  componentDidMount(){

      var today = new Date();
      var default_dob = (today.getFullYear()-18);
      default_dob += "-"+(today.getMonth()>10 ? today.getMonth() : "0"+today.getMonth());
      default_dob += "-"+(today.getDate()>10 ? today.getDate() : "0"+today.getDate());


      getUserData().then(rData => {
				if (rData === null) {
          this.props.history.push(CS_ROUTE['get_otp']);
				} else {
					console.log("userData",rData);
          setUser(rData);
				}
			});
            
    // var uData = getUser();
    // console.log("userData",uData);

    // if(uData!=null){
    //   const dob = uData.dob == "0000-00-00" ? default_dob : uData.dob;
      
    //   this.setState({
    //     first_name: uData.first_name,
    //     last_name:  uData.last_name,
    //     dob:        dob
    //   });
    // }else{
    //   this.setState({dob:default_dob});
    // }
  }

  getAge(DOB) {
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }    
    return age;
}

  handleChange = input => e =>{
    e.preventDefault();
    this.setState({[input]:e.target.value,errorMsg: ""});
  }

  nextStep = (step) => {


    if(this.state.first_name==="" || this.state.last_name==="" ){
      this.setState({errorMsg:"First Name & Last Name must be enter."});
      this.props.history.push('/basic_info');
      return false;
    }

    if(step===3 && (this.state.dob==="" || this.state.dob==="0000-00-00")){
      this.setState({errorMsg:"Please fill your dob."});
      this.props.history.push('/basic_info/dob');
      return false;
    }

    switch (step) {

      case 2: this.props.history.push('/basic_info/dob'); break;
      
      case 3: this.props.history.push('/basic_info/gender'); break;
      
      case 4: 
        this.saveFrom();
      break;

    }
  }

  saveFrom = () => {

    console.log("SEND DATA",this.state);

    if(this.state.first_name===""){
      this.setState({errorMsg:"First Name & Last Name must be enter."});
      return false;
    }

    const reqOptions = {
      method: "POST",
      //headers: {'Content-Type': 'application/json'},
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Authorization" :"Bearer " + getToken()
      },
      //body: JSON.stringify({this.state})
      body: serializeJSON(this.state) 
    }

    fetch(API_ROUTE.BASIC_INFO, reqOptions)
      //.then(response => response.json())
      .then(response => {
        if (response.ok) return response.json();
        return response.json().then(response => {
          const error = response.message?response.message:"Server Issue, Please try later";
          throw new Error(error)
        })
      })
      .then(async data =>{
        
        console.log("BASIC DATA=",data);

        //this.props.history.push(CS_ROUTE[data.current_screen]);
        this.props.history.push(CS_ROUTE['selfie']);
        
      })
      .catch(error => {
        this.setState({errorMsg:error.toString(),isLoaded:false});
        console.log("ERROR::",error);
      });
  }

  handleRedirect = (path) => {
    setCurrentScreen(path);
    this.props.history.push(path);
  }

  redirect = (path) =>{
    if(path !=null)
      this.props.history.push(path);
    else{
        //this.props.history.push('/');
    } 
  }

  randerPage() {
    
    const pData = pagesData[this.props.location.pathname];

    switch (this.props.location.pathname) {
      case "/basic_info":
        return <FullName data={this.state} pData={pData} nextStep={this.nextStep} handleChange={this.handleChange}/>;
      case "/basic_info/dob":
        return <DOB data={this.state} pData={pData} nextStep={this.nextStep} handleChange={this.handleChange}/>;
      case "/basic_info/gender":
        return <Gender data={this.state} pData={pData} nextStep={this.nextStep} handleChange={this.handleChange} />;
      case "/basic_info/selfie":
        return <Selfie redirectPage={this.handleRedirect}/> ;
      default:
        return <div>Invalid Registratoin page</div>;
    }
  }

  

  render() {
    
    


    if (getLocalToken() === null && getLocalToken() === "") {
      return (
        <div>
          <Redirect to="/" />
        </div>
      );
    }

    return <div>{this.randerPage()}</div>;
  }
}

const FullName = (props) => {

  console.log("FULL NAME PROPS=", props);
  const { first_name,last_name, errorMsg} = props.data;
  const {pageTitle,pageContent} = props.pData;

  return (
    <div>
      <p className="head_text">
        <strong>{pageTitle}</strong>
      </p>
      <p className="input_head_p new-line"> {pageContent}</p>
      <div className="input_div">
        <input type="text" value={first_name} className="form-control form_input" placeholder="Enter First Name" onChange={props.handleChange('first_name')} />
        <input type="text" value={last_name} className="form-control form_input" placeholder="Enter Last Name" onChange={props.handleChange('last_name')}/>
      </div>
     
        <div className={"error " + (errorMsg !== "" ? " show " : "")}>{errorMsg}</div>
        <button className="btn app_btn" onClick={() => props.nextStep(2)}>Next</button>
     
    </div>
  );
};

const DOB = (props) => {

  console.log("FULL NAME PROPS=", props);
  const {errorMsg} = props.data;
  const { dob } = props.data;

  return (
    <div>
      <p className="head_text"><strong>Enter your Date of Birth</strong></p>
      <p className="input_head_p">DOB should be as per your Pan Card</p>
      <div className="row input_div">
        <div className="col-lg-8 col-8" style={{ margin: 'auto' }}>
          <input type="date" className="form-control form_input" value={dob} placeholder="dd-mm-yyyy" min="1950-01-01" max="2003-01-01" onChange={props.handleChange('dob')} />
        </div>
      </div>
      <div className={"error " + (errorMsg !== "" ? " show " : "")}>{errorMsg}</div>
      <p><button className="btn app_btn" onClick={() => props.nextStep(3)}>Next</button></p>
    </div>
  );
};

const Gender = (props) => {
  
  const {errorMsg} = props.data;
  const { gender } = props.data;

  return (
    <div>
      <p className="head_text"><strong>Select your Gender</strong></p>
      <div className="input_div" id="myDIV">
        <p><button className={'btn select_lang' + (gender === 'm' ? ' btnactive' : '')} onClick={props.handleChange('gender')} value="m">Male</button></p>
        <p><button className={'btn select_lang' + (gender === 'f' ? ' btnactive' : '')} onClick={props.handleChange('gender')} value="f">Female</button></p>
        <p><button className={'btn select_lang' + (gender === 't' ? ' btnactive' : '')} onClick={props.handleChange('gender')} value="t">Others</button></p>
      </div>
      <div className={"error " + (errorMsg !== "" ? " show " : "")}>{errorMsg}</div>
      <p><button className="btn app_btn" onClick={() => props.nextStep(4)}>Next</button></p>
    </div>
  );
};
