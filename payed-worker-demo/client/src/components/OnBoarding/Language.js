import React, { Component } from 'react'
import { Redirect } from "react-router";
import { serializeJSON } from '../../helper/Funcs';
import { getToken } from "../../session/Control";
import { API_ROUTE, CS_ROUTE } from "../../data/Config"
export default class LanguageChoose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      selectedLang: "1",
      //languagesList : [],
      languagesList: [],
    }
  }
  handleChange = input => e => {
    e.preventDefault();
    this.setState({ [input]: e.target.value, errorMsg: "" });
  }
  componentDidMount() {
    this.getLanguages();
  }
  getLanguages = () => {
    console.log("Lang List=", this.state.languagesList);
    if (this.state.languagesList.length === 0) {
      console.log("Fetching Lang..............");

      //Start Loader
      //this.setState({isLoaded: true});
      const reqOptions = {
        method: "GET",
        //headers: {'Content-Type': 'application/json'},
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Authorization": "Bearer " + getToken()
        },
        //body: JSON.stringify({mobile_no:mobile_no,otp:enter_otp,token:token})
        //body: serializeJSON({access_token:getToken()})
      }
      fetch(API_ROUTE.GET_LANG, reqOptions)
        //fetch('http://192.168.29.54/payed/api/languages',reqOptions)
        .then(res => res.json())
        .then(result => {

          console.log('GET LANG', result);
          if (result.length > 0) {
            this.setState({ languagesList: result })

          } else {
            this.setState({ errorMsg: 'Can not fetch Languages, please try again', tncContent: { content: "No Content Found" }, isLoaded: false });
          }
        }).catch(error => {
          console.log("ERRROR", error);
          //this.setState({errorMsg:error.toString(),tncContent:{content:"No Content Found"},isLoaded:false});
        });
      //console.log("DATA",data);
      // this.setState({
      //   isLoaded: false,
      //   languagesList:data
      // });
    }
  }
  saveLang = (e) => {

    e.preventDefault();

    const lang_id = this.state.selectedLang;
    const token = getToken();


    const reqOptions = {
      method: "POST",
      //headers: {'Content-Type': 'application/json'},
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Authorization": "Bearer " + getToken()
      },
      //body: JSON.stringify({access_token:token,id:lang_id})
      body: serializeJSON({ language_id: lang_id })
    }
    fetch(API_ROUTE.SET_LANG, reqOptions)
      //.then(response => response.json())
      .then(response => {
        if (response.ok) return response.json();
        return response.json().then(response => {
          const error = response.message ? response.message : "Server Issue, Please try later";
          throw new Error(error)
        })
      })
      .then(async data => {

        //console.log("GET DATA=",data);
        this.props.redirectPage(CS_ROUTE['basic_info']);

        //check logged user basic info then redirect current_screen
        //sessionStorage.getItem("user")
        //this.props.redirectPage(CS_ROUTE[data.current_screen]);

        //          
      })
      .catch(error => {
        this.setState({ errorMsg: error.toString(), isLoaded: false });
        console.log("ERROR::SET LANG=", error);
      });
    // this.setState({
    //   selectedLang : e.target.value
    // });
  }

  render() {

    //if( getToken() === null){ return( <div><Redirect to="/" /></div> ) }
    const { isLoaded, errorMsg, selectedLang, languagesList } = this.state;
    if (isLoaded) {
      return <Loading />;
    } else {
      return (
        <div>
          <p className="head_text">
            <strong>
              Select the Language of <br /> your Choice
            </strong>
          </p>
          <div className="input_div" id="myDIV">
            {languagesList.map((Lang, index) => (
              <button className={'btn select_lang' + (Lang.id === selectedLang ? ' btnactive' : '')} key={index} value={Lang.id} onClick={this.handleChange('selectedLang')}>{Lang.title}</button>
            ))
            }
          </div>
          <div className={"error " + (errorMsg !== "" ? " show " : "")}>{errorMsg}</div>
          <p>
            <button className="btn app_btn" onClick={this.saveLang}>Next</button>
          </p>
        </div>
      )
    }
  }
}
const Loading = (props) => (
  <div>Loading... </div>
)