import React from 'react'
import { Component } from 'react'
import "./index.css";
import  {VerifyOTP } from "../OnBoarding/Login";
import PopUpBox from './../../common/PopUpBox';
import {serializeJSON,getWeekNumber,str_pad} from '../../helper/Funcs';
import { API_ROUTE,CS_ROUTE } from "../../data/Config"
import { getUserData, getKYCData } from "../../services/UserAPI";
import { getToken, getUser, setUser,setWithdrawStatus,isWithdrawStatusCheck, isUnLockAPP, setCurrentScreen,setOTPVerify } from '../../session/Control';
import Menu from './Menu';
const WITHDRAW_MIN 		= parseFloat(process.env.REACT_APP_WITHDRAW_MIN);
const WITHDRAW_CHARGE 	= parseFloat(process.env.REACT_APP_WITHDRAW_CHARGE);
const WITHDRAW_GST 		= parseFloat(process.env.REACT_APP_WITHDRAW_GST);
const WEEKLY_CHARGE 	= [
							process.env.REACT_APP_WITHDRAW_W1,
							process.env.REACT_APP_WITHDRAW_W2,
							process.env.REACT_APP_WITHDRAW_W3,
							process.env.REACT_APP_WITHDRAW_W4,
							process.env.REACT_APP_WITHDRAW_W5,
						]
export default class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			errorMsg: "",
			userData: null,
			withdraw_amt:0,
			net_amt:0,
			con_fees:0,
			gst:0,
			showWithdrawForm:false,
			popUpData: {
                show: false,
                success: false,
                content: "",
                redirect: ""
            },
			token: "",	//OTP token for verfication while send withdraw request
			mobile_no : "",
			menuOn: false,
			blueMsg:""
		}
	}
	componentDidMount() {
		this.getUserData();
	}
	getUserData = () =>{
		setOTPVerify('');
		getUserData().then(rData => {
			if (rData != null && rData) {
				setUser(rData);
				if(rData.transactions && (rData.transactions[0].status=="0" || rData.transactions[0].status=="2" )){
					console.log("TRANS===",isWithdrawStatusCheck());
					if(isWithdrawStatusCheck() == null)
					 	this.checkWithdrawRequestStatus();
				}
				this.setState({ userData: rData });
			} else {
				if (getToken() == null || getToken() == "") {
					this.props.history.push(CS_ROUTE['get_otp']);
				} else {
					if (isUnLockAPP() == null || isUnLockAPP() == "")
						this.props.history.push(CS_ROUTE['unlock_app']);
				}
			}
		});
	}
	
	handleChange = input => e => {
        e.preventDefault();
		var net_amt = 0;
		var con_fees = 0;
		var gst = 0;
		if(input == 'withdraw_amt' && e.target.value>0){
			const weekly_charge = parseFloat(WEEKLY_CHARGE[getWeekNumber()])
			console.log("weekly_charge=",weekly_charge);
			console.log("WITHDRAW_CHARGE=",WITHDRAW_CHARGE);
			con_fees = parseFloat( WITHDRAW_CHARGE + ( e.target.value * weekly_charge / 100));
			gst = parseFloat((con_fees * WITHDRAW_GST ) /100); 
			net_amt = parseFloat(e.target.value) - ( con_fees + gst ) ;
			console.log("con_fees=",con_fees);
			console.log("gst=",gst);
			console.log("net_amt=",net_amt);
		}
		this.setState({ [input]: e.target.value , errorMsg: "",net_amt:net_amt,con_fees:con_fees,gst:gst });
    }
	//Start::For OTP screen
	handleRedirect = (path) => {
		//this.setState({redirect:path});
		console.log("REDIRECT",path);
		setCurrentScreen(path);
		this.props.history.push(path);
	}
	receivedOTPData = (data) => {
		this.setState({token:data.token,mobile_no:data.mobile_no});
	}
	//END::For OTP screen
	showWithdrawForm = () => {
		const {userData} = this.state;
		if(userData.kyc_verified !== "1" || userData.bank_verified !== "1" ){
			alert("Please verify Account for withdraw.");
			return false;
		}
		this.setState({showWithdrawForm:true});
	}
	verifyOTPRequest = () =>{
		const {withdraw_amt,userData} = this.state;
		if(withdraw_amt ==0 || withdraw_amt == ""){
			this.setState({ errorMsg: "Please enter Amount." });
            return false;
		}
		if( (+withdraw_amt !== +withdraw_amt)  || withdraw_amt < 0){
			this.setState({ errorMsg: "Please enter valid amount." });
            return false;
		}
		if(withdraw_amt > userData.withdraw_upto){
			this.setState({ errorMsg: "Invalid Enter Amount, Please enter amount below withdraw upto." });
            return false;
		}
		if(withdraw_amt < WITHDRAW_MIN ){
			this.setState({ errorMsg: `Amount should be at least ${WITHDRAW_MIN} INR` });
			return false;
		}
		const reqOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Authorization" :"Bearer " + getToken()
            }
        }
        fetch(API_ROUTE.VERIFY_REQ, reqOptions)
            .then(response => {
                if (response.ok) return response.json();
                return response.json().then(response => {
                  const error = response.message?response.message:"Server Issue, Please try later";
                  throw error
                })
              })
            .then(async data => {
                const { token,message } = data;
				if(token!=""){
					this.receivedOTPData(data);
					//Set Redirect for Verify OTP page after verify otp
					setOTPVerify('/dashboard');
					this.props.history.push('/dashboard/verify_otp');
				}else{
					this.setState({ errorMsg: message });
				}
            }).catch(error => {
                console.log("ERRROR", error);
            });
		
	}
	sendWithdrawRequest = () => {
		const {withdraw_amt,net_amt,con_fees,gst,showWithdrawForm} = this.state;
		if(withdraw_amt == undefined || withdraw_amt==0){
			this.props.history.push('/dashboard');
			return;
		}
		this.setState({isLoaded:true});
		//alert('sending request');
		const reqOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Authorization" :"Bearer " + getToken()
            },
            body: serializeJSON({withdraw_amt:withdraw_amt,net_amt:net_amt,con_fees:con_fees,gst:gst})
        }
        
        fetch(API_ROUTE.WITHDRAW_REQ, reqOptions)
            .then(response => {
                if (response.ok) return response.json();
                return response.json().then(response => {
                  const error = response.message?response.message:"Server Issue, Please try later";
                  throw error
                })
              })
            .then(async data => {
				//We dont need to call checkWithdrawRequestStatus after request
				setWithdrawStatus(true);
                const { message,status } = data;
				
				const success = (status == "0" || status == "1") ? true:false;
				this.setState({
					withdraw_amt:0,
					showWithdrawForm:false,
					isLoaded:false,
					popUpData: { show: true, success: success, content: message}
				});
            }).catch(error => {
                
				this.setState({isLoaded:false, popUpData: { show: true, success: false, content: error } });
                console.log("ERRROR", error);
            });
	}
	checkWithdrawRequestStatus = () => {
		this.setState({isLoaded:true});
		const reqOptions = {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Authorization" :"Bearer " + getToken()
            }
        }
        fetch(API_ROUTE.WITHDRAW_STATUS, reqOptions)
            .then(response => {
                if (response.ok) return response.json();
                return response.json().then(response => {
                  const error = response.message?response.message:"Server Issue, Please try later";
                  throw error
                })
              })
            .then(async data => {
                const { status, message } = data;
				
				if(status == "1"){
					setTimeout(function () {
						document.location.reload();
					}, 5000); 
				}
				setWithdrawStatus(true);
				this.setState({blueMsg:message});
            }).catch(error => {
                console.log("ERRROR", error);
            });
	}
	closePopUP = () => {
        this.setState({ popUpData: { show: false } });
        const { success,redirect } = this.state.popUpData;
		this.getUserData();
    }
	menuShowHide =(toggle) =>{
		console.log('Show Menu');
		var show = toggle==true?true:false;
		this.setState({menuOn:show});
	}
	render() {
		const current_path = this.props.location.pathname;
		const {menuOn,blueMsg} = this.state;
	switch(current_path){
		case '/dashboard/verify_otp':
			return <VerifyOTP  data={this.state} handleChange={this.handleChange} redirectPage={this.handleRedirect} receivedOTPData={this.receivedOTPData} sendWithdrawRequest={this.sendWithdrawRequest}/>;
		default:
		const { userData,showWithdrawForm,popUpData } = this.state;
		
		console.log("userData==", userData);
		var transactions = "";
		if(userData && userData.transactions)
			{
			transactions = userData.transactions.map( (t, i) =>{
				if(i< 3){
					return (
						<tr key={t.id}>
						<td>{str_pad('0000000',t.id,true)}</td>
						<td>{t.req_amount}</td>
						<td>{formatJSDate(t.created,'dd MMM y')}</td>
						<td>{t.status==1?'Updated':t.status==-1?'Rejected':'Pending'}</td>
						</tr>
						)
				}
			});
		}
		if (userData == null) {
			return <Loading />;
		} else {
			return (
				<div className="container-fluid salary-flow">
					{
						menuOn === true ? <Menu show={menuOn} menuShowHide={this.menuShowHide}/> : null
					}
					<div className="row salaryHeader">
						<div className="col-2 padLeftRight0" onClick={()=>this.menuShowHide(true)}>
							<img src="images/menu1.png" className="img-fluid " />
						</div>
						<div className="col-8"></div>
						<div className="col-2 padLeftRight0" align="right">
							{//<img src="images/profilepic.png" className="img-fluid img-circle" />
							}
							<p className="profileName blueBg">
								{userData.first_name.substring(0,1)}
								{userData.last_name.substring(0,1)}
							</p>
						</div>
					</div>
					<div className="row salaryFlow">
						<div className="container">
							<p className="name">Hello {userData.first_name},</p>
							{
								(blueMsg!="")
								?
								<p className="blueMsg">{blueMsg}</p>
								:null
							}
							{
								(userData.kyc_verified == 1 && userData.bank_verified == 1)
									?
									<p className="kycStatus">Account Verified <img src="images/verified.png" /></p>
									:
									
									<div>
									<div className="completeBox">
										<a href="/account_verification">Complete your Account Verification</a>
									</div>
									<p className="msgAccess">Please complete your verification</p>
									<p className="salaryAccess">to get early access to your salary</p>
									</div>
								
							}
							<div className={"col-12 centerContent " + (userData.withdraw_upto? "":"disableContent") }>
								{
									(showWithdrawForm == false) ?
									<WithdrawUpTo data={this.state} showWithdrawForm={this.showWithdrawForm}/>
									:
									<WithdrawRequest data={this.state} handleChange={this.handleChange} verifyOTPRequest={this.verifyOTPRequest} />
								}
							</div>
							<div className="row salaryHead">
								<div className="col-6">
									<p>Net Monthly Salary</p>
								</div>
								<div className="col-6">
									<p>Earned Salary</p>
								</div>
							</div>
							<div className="row salaryRec">
								<div className="col-6">
									<p>{userData.net_salary?userData.net_salary:0} INR</p>
								</div>
								<div className="col-6">
									<p>{userData.earned?userData.earned:0} INR</p>
								</div>
							</div>
							<p className="recentTrans">Recent Transactions</p>
							{
								(
								userData.transactions) ?
								 <div className="row table-responsive transTab">
									 <table className="table transactionTable">
										 <thead>
										<tr>
											<th>Transactions</th>
											<th>Amount</th>
											<th>Date</th>
											<th>Status</th>
										 </tr>
										 </thead>
										 <tbody>
										 	{transactions}
										 </tbody>
									</table>
									 
								 </div>
								: <p className="recentTransRec">No Transactions</p>
							}
						</div>
					</div>
					<PopUpBox data={popUpData} closePopUP={this.closePopUP} />
				</div>
			)
		}
	}//end Switch
	}
}
const WithdrawUpTo = (props) => {
	const {userData,isLoaded} = props.data;
	var disabled_wb = false;
	//Withdraw button disable when last transaction is pending
	if( userData.transactions && userData.transactions.length>0 && userData.transactions[0].status == "0")
		disabled_wb = true;
	//Withdraw button disable when there's no withdraw amount
	if(!userData.withdraw_upto) disabled_wb = true;
	return (
		<div className="upto">
			<p>Withdraw Upto</p>
			<p>{userData.withdraw_upto?userData.withdraw_upto:0} INR</p>
			<button className="btn btnWithdraw" onClick={props.showWithdrawForm} disabled={disabled_wb} >
				Withdraw
			</button>
			{
				userData.transactions && userData.transactions[0].status == "0"
				? <p>You can not withdraw because your last transaction is still pending .</p>
				: null
			}
			{
				userData.earned_updated?
				<p>Atendance Update {userData.earned_updated}</p>
				:null
			}{
				userData.withdrawal_amount ?
				<p>Total Withdrawal Amount: {userData.withdrawal_amount} INR</p>
				:null
			}
		</div>
	)
}
const WithdrawRequest = (props) => {
	const {userData,net_amt,con_fees,gst,errorMsg,isLoaded} = props.data;
	return (
		<div className="amountEnter">
			<p className="amtLabel">Enter amount to Withdraw</p>
			
			<input type="text" className="form-control form_input" style={{textAlign:'center'}} placeholder="0"
				maxLength="10"
				onChange={props.handleChange('withdraw_amt')}
			/>
			<p className="ins">Withdraw upto<br />  <span>{userData.withdraw_upto?userData.withdraw_upto:0} INR</span></p>
			<div className="row paymentDetail">
				<div className="col-8">
					<p>Min Withdrawal:</p>
				</div>
				<div className="col-4">
					<p>{WITHDRAW_MIN} INR</p>
				</div>
				<div className="col-8">
					<p>Convenience Fees:</p>
				</div>
				<div className="col-4">
					<p>{con_fees.toFixed(2)} INR <img src="images/instruction.png" style={{marginBottom:'3px'}} /></p>
				</div>
				<div className="col-8">
					<p>GST:</p>
				</div>
				<div className="col-4">
					<p>{gst.toFixed(2)} INR</p>
				</div>
				<div className="col-8">
					<p>Net Amount to be credited:</p>
				</div>
				<div className="col-4">
					<p>{net_amt.toFixed(2)} INR</p>
				</div>
			</div>
			<div className={"error " + (errorMsg !== "" ? " show " : "")}>{errorMsg}</div>
			<button className="btn btnConfirm" onClick={props.verifyOTPRequest} disabled={isLoaded}>Confirm</button>
			{
				(isLoaded)
				?
				<div style={{background:'#444',color:'#fff'}}>Please wait...</div>
				:
				null
			}
		</div>
	);
}
const Loading = (props) => (
	<div>Loading... </div>
)

function formatJSDate(date=null,formatFrom='',formatTo=''){
	var dt = date==null? new Date() : new Date(date);
	var [d,m,y,h,mn,s] = [dt.getDate(),dt.getMonth(),dt.getFullYear(),dt.getHours(),dt.getMinutes(),dt.getSeconds()];
	m+=1;
	d = d<10? '0'+d:d;
	m = d<10? '0'+m:m;
	h = h<10? '0'+h:h;
	if(formatFrom!=''){
		var month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
       	var month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		formatFrom = formatFrom.replace('MMM',month_names_short[m]);
		formatFrom = formatFrom.replace('dd',d);
		formatFrom = formatFrom.replace('y',y);
		return formatFrom;
	}else{
		var current_date = d + "-" + m + "-" + y + " " + h + ":" + mn;
		return current_date;
	}
    return null;
}