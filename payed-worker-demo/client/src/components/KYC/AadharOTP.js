import React, { Component } from 'react'
import { serializeJSON } from '../../helper/Funcs';
import { getToken } from "../../session/Control";
import { API_ROUTE } from "../../data/Config"
export default class AadharOTP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            errorMsg: "",
            aadhar_otp: ""
        };
    }
    componentDidMount() {
        //parent states values
        console.log("values=", this.props.values)
    }
    handleChange = input => e => {
        e.preventDefault();
        this.setState({ [input]: e.target.value, errorMsg: "" });
    }
    verifyOTP = (e) => {
        e.preventDefault();
        const aadhar_otp = this.state.aadhar_otp;
        if (aadhar_otp == "") {
            this.setState({ errorMsg: 'Please enter OTP' });
            return false;
        }
        if (aadhar_otp.length !== 4) {
            this.setState({ errorMsg: 'OTP should be 4 digits' });
            return false;
        }
        this.props.verifyAadharOTP(aadhar_otp, "account_verification");
    }
    render() {
        const { isLoaded, pData } = this.props;
        const { errorMsg } = this.state;
        //console.log("values=",this.props.values)
        return (
            <div>
                <p className="head_text"><strong>{pData.pageTitle}</strong></p>
                <div className="input_div" id="myDIV">
                    <input
                        type="tel"
                        autoFocus
                        maxLength="6"
                        className="form-control form_input"
                        placeholder="Enter OTP"
                        onChange={this.handleChange('aadhar_otp')}
                    />
                </div>
                <div>
                    <p>Didn't receive the verification OTP?</p>
                    <p>
                        <a href="#">Resend again</a>
                    </p>
                </div>
                <div className={"error " + (errorMsg !== "" ? " show " : "")}>{errorMsg}</div>
                <p><button className="btn app_btn" onClick={this.verifyOTP}>Next</button></p>
                {
                    (isLoaded)
                        ?
                        <div style={{ background: '#444', color: '#fff' }}>Please wait...</div>
                        :
                        null
                }
            </div>
        )
    }
}