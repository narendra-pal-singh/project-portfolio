import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import { getUserData } from "../../services/UserAPI";
import { API_ROUTE,CS_ROUTE } from "../../data/Config"
import { getToken, setUser, isUnLockAPP } from '../../session/Control';
export default class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			errorMsg: "",
			userData: null,
			viewPage:''
		}
	}
	componentDidMount() {
		this.getUserData();
	}
	getUserData = () =>{
		getUserData().then(rData => {
			if (rData != null && rData) {
				setUser(rData);
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
	chagnePage = (page) =>{
		if(page!=null && page!="")
			this.setState({viewPage:page})
	}
    render() {
		var {userData} = this.state;
        return (
            <div>
				<center><p className="my_transaction">My Profile</p></center>
				<div className="row mrgn_zero">					
					<div className="col-lg-12 pd_lft_rt">
						<div className="row all_transaction">
							<div className="col-lg-7 col-7 pd_lft_rt2">
								<p>
									<span className="profile_name">
									{
									userData ?
									userData.first_name +" "+ userData.last_name
									:null
									}
									</span>
									<br />
									Area Manager
								</p>
							</div>
							<div className="col-lg-5 col-5 pd_lft_rt2">
								<p>Werehouse Now</p>
							</div>						
						</div>
					</div>					
				</div>
		<div className="row mrgn_zero">					
					<div className="col-lg-12 pd_lft_rt">
						<div className="row all_transaction_data">
							<div className="col-lg-8 col-8 pd_lft_rt2">
								<p>Personal Information</p>
								<p><span>Name, DOB, Address, Gender</span></p>
							</div>
							<div className="col-lg-4 col-4 pd_lft_rt2">
								<NavLink activeClassName="active" to='/menu/view_profile/' >
								<p className="view_content_p" >
								<img src="/images/eye.png"></img>
								</p>
								</NavLink>
							</div>						
						</div>
						<div className="row all_transaction_data">
							<div className="col-lg-8 col-8 pd_lft_rt2">
								<p>Attendance Information</p>
								<p><span>Present Days, Absent Days</span></p>
							</div>
							<div className="col-lg-4 col-4 pd_lft_rt2">	
								<NavLink activeClassName="active" to='/menu/attendance' >
								<p className="view_content_p" >
								<img src="/images/eye.png"></img>
								</p>
								</NavLink>
							</div>						
						</div>						
						<div className="row all_transaction_data">
							<div className="col-lg-8 col-8 pd_lft_rt2">
								<p>Manage Notification</p>
								<p><span>want to get SMS</span></p>
							</div>
							<div className="col-lg-4 col-4 pd_lft_rt2">								
							<p className="view_content_p" >
								<img src="/images/eye.png"></img>
								</p>
							</div>						
						</div>
					</div>					
				</div>
            </div>
        )
    }
}