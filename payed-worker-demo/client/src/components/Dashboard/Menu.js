import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
export default class Menu extends Component {
    constructor(props) {
		super(props);
		this.state = {
			show: false
        }
    }
    hideMenu = () =>{
        this.props.menuShowHide(false);
    }
    render() {
        const {show} = this.props;
        if(show==true){
        return (
            <div>
                <div className="row">
                    <div className="menu-bg" onClick={this.hideMenu}></div>
                    <div className="col-lg-12 mob_nav">
                        <ul className="nav navbar-nav my-navbar na_mob">
                            <li>
                                <NavLink activeClassName="active" to='/menu/transactions' >
                                    <span>
                                        <img src="images/profile_icon.png" alt="transaction" className="img-fluid" /></span>
                                    <span>My Transactions</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="active" to='/menu/profile' >
                                    <span><img src="images/profile_icon.png" alt="profile" className="img-fluid" /></span>
                                    <span>Profile Settings</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="active" to='/login' >
                                    <span><img src="images/change_pin_icon.png" alt="change pin" className="img-fluid" /></span>
                                    <span>Change Pin</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="active" to='/dashboard' >
                                    <span><img src="images/change_pin_icon.png" alt="change pin" className="img-fluid" /></span>
                                    <span>Bank Settings</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="active" to='/dashboard' >
                                    <span><img src="images/change_pin_icon.png" alt="change pin" className="img-fluid" /></span>
                                    <span>Support</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName="active" to='/dashboard' >
                                    <span><img src="images/change_pin_icon.png" alt="change pin" className="img-fluid" /></span>
                                    <span>About Us</span>
                                </NavLink>
                            </li>
                            
                            <li>
                                <NavLink activeClassName="active" to='/logout' >
                                    <span><img src="images/logout_icon.png" alt="logout" className="img-fluid" /></span>
                                    <span>Logout</span>
                                </NavLink></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
                    }else{
                        return null;
                    }
    }
}
