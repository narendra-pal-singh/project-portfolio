import React, { Component } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios';
//import './index.css';
import {serializeJSON} from '../../helper/Funcs';
import PopUpBox from './../../common/PopUpBox';
import { pagesData } from '../../data/AppData';
import { isValidPanCardNo } from '../../helper/Funcs';
import { API_ROUTE, CS_ROUTE } from "../../data/Config"
import { getToken,setUser, setCurrentScreen } from "../../session/Control"
import { getUserData } from "../../services/UserAPI";
import DL from './DL';
import PanCard from './PanCard';
import AadharCard from './AadharCard';
import AadharOTP from './AadharOTP';
import BankDetails from './BankDetails';
export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: true,
            errorMsg: "",
            //selectedDoc: "",
            selectKYC: "",
            doneKYC: {"pan_card":true,aadhar_card:false,address_proof:false,bank_details:false},
            //selectAddressProof: "",
            document_no:"",
            request_id:"",  //Karza request id
            popUpData: {
                show: false,
                success: false,
                content: "",
                redirect: ""
            },
            userData:""
        };
        this.browserDoc = React.createRef();
    }
    componentDidMount() {
        //GET USER Data with KYC & Bank Details if varify then redirect dashboard
        getUserData().then(rData => {
			if (rData!=null && rData) {
                setUser(rData);
                this.setState({ userData: rData });
                if(rData.kyc_verified == 1 && rData.bank_verified){
                    this.props.history.push(CS_ROUTE['dashboard']);
                }else{
                    this.setState({ isLoaded: false });
                }
			} else {
                alert('User data not getting');
			}
		});
        
    }
    onFileUpload = async (type, doc_no, doc_front, doc_back = null, redirect) => {
        const formData = new FormData();
        if (doc_no !== null && doc_no !== "")
            formData.append("document_no", doc_no);
        formData.append("type", type);
        if(doc_front)
            formData.append("document_file", doc_front);
        const reqOptions = {
            method: 'POST',
            headers: {
                "Authorization" :"Bearer " + getToken()
            },
            body: formData
        };
        fetch(API_ROUTE.UPLOAD_DOC, reqOptions)
            .then(response => response.json())
            .then(async response => {
                const { status, access_token, message, current_screen } = response;
                this.setState({ popUpData: { show: true, success: status, content: message, redirect: redirect } });
            }).catch(error => {
                console.log("ERRROR", error);
            });
    };
    verifyDoc = async (type, doc_no, doc_front, doc_back = null, redirect) => {
        const formData = new FormData();
        if (doc_no !== null && doc_no !== "")
            formData.append("document_no", doc_no);
        formData.append("type", type);
        if(doc_front)
            formData.append("document_file", doc_front);
        this.setState({isLoaded:true});
        const reqOptions = {
            method: 'POST',
            headers: {
                "Authorization" :"Bearer " + getToken()
            },
            body: formData
        };
        fetch(API_ROUTE.VERIFY_DOC, reqOptions)
            //.then(response => response.json())
            .then(response => {
                if (response.ok) return response.json();
                return response.json().then(response => {
                  const error = response.message?response.message:"Server Issue, Please try later";
                  //throw new Error(error)
                  throw error;
                })
              })
            .then(async response => {
                const { message, document_no } = response;
                this.setState({document_no:document_no, popUpData: { show: true, success: true, content: message, redirect: redirect },isLoaded:false });
            }).catch(error => {
                console.log(error);
                this.setState({ popUpData: { show: true, success: false, content: error.toString() } ,isLoaded:false});
            });
        //axios.post("api/uploadfile", formData);
    };
    verifyAadharOTP = async (otp, redirect) => {
        //validate aadhar_no & request_id 
        const {document_no,request_id} = this.state;
        if(document_no=="" && request_id==""){
            //redirect aadhar card page
        }
        const reqOptions = {
            method: "POST",
            headers: {
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
              "Authorization" :"Bearer " + getToken()
            },
            body: serializeJSON({aadhar_otp:otp,document_no:document_no,request_id:request_id})
        }
        fetch(API_ROUTE.AADHAR_OTP, reqOptions)
          .then(response => {
                if(response.ok) return response.json();
                return response.json().then(response => {
                const error = response.message?response.message:"Server Issue, Please try later";
                throw error;
                })
            })
          .then(async data =>{
            console.log("AADHAR_OTP Data",data);
            
            const { message } = data;
            this.setState({ popUpData: { show: true, success: true, content: message, redirect: redirect } });
          }).catch(error => {
            console.log(error);
            this.setState({ popUpData: { show: true, success: false, content: error.toString() } });
        });
    }
    //saveKYC = async (data, redirect) => {
    saveBankDetails = async (data, redirect) => {
        this.setState({isLoaded:true});
        
        const reqOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Authorization" :"Bearer " + getToken()
            },
            body: serializeJSON(data)
        }
        
        fetch(API_ROUTE.SAVE_BANK, reqOptions)
            //.then(response => response.json())
            .then(response => {
                if (response.ok) return response.json();
                return response.json().then(response => {
                  const error = response.message?response.message:"Server Issue, Please try later";
                  throw new Error(error)
                })
              })
            .then(async response => {
                const { message } = response;
                this.setState({ isLoaded:false, popUpData: { show: true, success: true, content: message, redirect: redirect } });
            }).catch(error => {
                this.setState({ isLoaded:false, popUpData: { show: true, success: false, content: 'Unable to Save Bank Data, Please try again' } });
                console.log("ERRROR", error);
            });
    }
    closePopUP = () => {
        this.setState({ popUpData: { show: false } });
        const { success, redirect } = this.state.popUpData;
        if (success === true) {
            this.nextStep(redirect);
        }
    }
    handleChange = input => e => {
        e.preventDefault();
        this.setState({ [input]: e.target.value, errorMsg: "" });
    }
    nextStep = (step) => {
        if (step === "") {
            this.setState({ errorMsg: "Please select verfication option." })
            return false;
        }
        //alert(step);
        if (CS_ROUTE[step] === undefined)
            this.props.history.push(CS_ROUTE['404']);
        else
            this.props.history.push(CS_ROUTE[step]);
        // switch (step) {
        //     case 2: this.props.history.push('/kyc/' + step); break;
        //     case 'pan_card': this.props.history.push('/kyc/' + step); break;
        //     case 'aadhar_card': this.props.history.push('/kyc/' + step); break;
        //     case 'address_proof': this.props.history.push('/kyc/' + step); break;
        //     case 'bank_details': this.props.history.push('/kyc/' + step); break;
        //     case 'address_details': this.props.history.push('/kyc/' + step); break;
        //     //Address Proof
        //     case 'dl': this.props.history.push('/kyc/address_proof/' + step); break;
        //     case 'voter_id': this.props.history.push('/kyc/address_proof/voter_id'); break;
        //     case 'rent_agreement': this.props.history.push('/kyc/address_proof/rent_agreement'); break;
        //     case 'hr_letter': this.props.history.push('/kyc/address_proof/hr_letter'); break;
        //     default: this.props.history.push(CS_ROUTE[step]); break;
        // }
    }
    randerPage() {
        const pData = pagesData[this.props.location.pathname];
        switch (this.props.location.pathname) {
            case "/kyc":
                return <KYC data={this.state} pData={pData} nextStep={this.nextStep} handleChange={this.handleChange} />;
            
            case "/kyc/pan_card":
                return <PanCard pData={pData} verifyDoc={this.verifyDoc} />;
            case "/kyc/aadhar_card":
                return <AadharCard pData={pData} verifyDoc={this.verifyDoc} nextStep={this.nextStep} />;
            case "/kyc/aadhar_card/otp":
                    return <AadharOTP pData={pData} verifyAadharOTP={this.verifyAadharOTP} />;
            case "/kyc/dl":
                 return <DL pData={pData} verifyDoc={this.verifyDoc} />;
            // case "/kyc/address_proof":
            //     return <AddressProof pData={pData} nextStep={this.nextStep} onFileUpload={this.onFileUpload} />;
            // case "/kyc/address_proof/voter_id":
            //     return <VoterID pData={pData} onFileUpload={this.onFileUpload} />;
            // case "/kyc/address_proof/rent_agreement":
            //     return <RentAgreement pData={pData} onFileUpload={this.onFileUpload} />;
            // case "/kyc/address_proof/hr_letter":
            //     return <HrLetter pData={pData} onFileUpload={this.onFileUpload} />;
            // case "/kyc/address_details":
            //     return <AddressDetails pData={pData} saveKYC={this.saveKYC} />;
            case "/kyc/bank_details":
                return <BankDetails isLoaded={this.state.isLoaded} pData={pData} saveBankDetails={this.saveBankDetails} />;
            default:
                return <div>Invalid Registratoin page</div>;
        }
    }
    render() {
        console.log("KYC Props", this.props);
        const { popUpData,isLoaded } = this.state;
        return (
            
            <div className="btmContent">
                {/* {isLoaded ?(
                <div>
                    <div style={{background: 'rgb(247 247 247)',display: 'table',padding: '0 5px',position:'absolute',height:'100%',width:'100%',opacity:'0.8'}}>
                    </div>
                    <div style={{position:'absolute',top:'50%',left:'28%',color:'red',fontSize:'20px'}}>
                        Please wait Loading
                    </div>
                </div>
                ) : (
                    <div></div>
                )} */}
                {this.randerPage()}
                <PopUpBox data={popUpData} closePopUP={this.closePopUP} />
            </div>)
    }
}
const KYC = (props) => {
    const { pData } = props;
    const { selectKYC, doneKYC, errorMsg, isLoaded } = props.data;
    console.log("selectKYC=", selectKYC);
    return (
        <div>
        <p className="head_text"><strong>{pData.pageTitle}</strong></p>
        <div className="first_btn_ofp">
               <Link to="/kyc/pan_card">
                <button className="btn verify_btn"
                    value="pan_card"
                    >PAN Card</button>
                </Link>
                <Link to="/kyc/aadhar_card">
                <button className={'btn verify_btn'}
                    value="aadhar_card"
                    >Aadhar Card</button>
                </Link>
                <Link to="/kyc/dl">
                <button className={'btn verify_btn'}
                    value="dl"
                    >DL</button>
                </Link>
        </div>
        <br/>
        <p className="verifyOpt"><sup>*</sup>Verify your KYC with any of the above options</p>
    </div>
    );
}
