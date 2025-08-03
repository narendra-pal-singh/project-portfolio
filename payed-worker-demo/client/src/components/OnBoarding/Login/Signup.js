import React, { Component } from 'react'
import { Redirect } from 'react-router';
import PopUpBox from '../../../common/PopUpBox';
import { API_ROUTE } from "../../../data/Config"
import AutoComplete from "../../../helper/AutoComplete"
import { serializeJSON } from '../../../helper/Funcs';
import { getToken } from '../../../session/Control';
export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      errorMsg: "",
      popUpShow: {
        show: false,
        success: false,
        content: "",
      },
      first_name: "",
      last_name: "",
      listItems: [],

      company_id: 0,
      company_name: ""

    }
  }
  handleChange = input => e => {
    e.preventDefault();
    this.setState({ [input]: e.target.value, errorMsg: "" });
  }
  componentDidMount() {

    console.log("Singup Props=", this.props);
    this.searchCompany();

  }
  searchCompany = () => {
    const reqOptions = {
      method: "GET",
      //headers: {'Content-Type': 'application/json'},
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      //body: JSON.stringify({access_token:getToken()})
      //body: serializeJSON({access_token:getToken()})
    }
    fetch(API_ROUTE.GET_COMPANIES, reqOptions).
      then(response => response.json()).
      then(result => {
        console.log("Company List=", result);
        this.setState({ listItems: result });
      }).catch(errro => {
      })
  }
  getCompanyValue = (id, value) => {
    this.setState({ company_id: id, company_name: value })
  }
  saveFrom = () => {
    const mobile_no = this.props.data.mobile_no;
    const { first_name, last_name, company_id, company_name } = this.state;
    if (first_name !== "" && last_name !== "" && company_name !== "") {
      this.setState({ isLoaded: true });

      const reqOptions = {
        method: "POST",
        //headers: {'Content-Type': 'application/json'},
        headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        //body: JSON.stringify({first_name:first_name,last_name:last_name,company_id:company_id,company_name:company_name})
        body: serializeJSON({ first_name: first_name, last_name: last_name, company_id: company_id, company_name: company_name, mobile_no: mobile_no })
      }

      fetch(API_ROUTE.SIGNUP, reqOptions)
        .then(response => response.json())
        .then(async response => {

          console.log("SIGUP DATA=", response);
          //this.setState({isLoaded:false});
          this.props.redirectPage('/login/thankyou');
          //PopUp Box
          //const {status,message }= response;
          //this.setState({popUpShow:{show:true,success:status,content:message}});
        })
        .catch(error => {
          this.setState({ errorMsg: error.toString(), isLoaded: false });
          console.log("ERROR::", error);
        });

    } else {
      this.setState({ errorMsg: "All fields must be enter for registration." });
    }
  }
  closePopUP = () => {
    this.setState({ popUpShow: { show: false } });
    if (this.state.popUpShow.show === true) {
      this.props.redirectPage("/");
    }

  }
  render() {

    //if( getToken() === null){ return( <div><Redirect to="/" /></div> ) }
    const { errorMsg, popUpShow } = this.state;
    console.log("popUpShow", popUpShow);
    return (
      <div>

        <center>
          <p className="head_text">Enter your Full Name and Company Name</p>
          <div className="input_div">

            <input type="text" onChange={this.handleChange('first_name')} className="form-control form_input" placeholder="Enter First Name" />
            <input type="text" onChange={this.handleChange('last_name')} className="form-control form_input" placeholder="Enter Last Name" />

            <AutoComplete placeHolder="Enter Your Company Name"
              items={this.state.listItems}
              item_key="id"
              item_data="name"
              getValue={this.getCompanyValue}
            />
          </div>

          <div className={(errorMsg != "" ? "error show" : "")}>{errorMsg}</div>
          <p><button className="btn app_btn" onClick={this.saveFrom}>Next</button></p>
        </center>
        <PopUpBox data={popUpShow} closePopUP={this.closePopUP} />
      </div>
    )
  }
}