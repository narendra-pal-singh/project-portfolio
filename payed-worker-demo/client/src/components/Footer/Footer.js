import React, { useEffect } from 'react'
import { useLocation, NavLink } from 'react-router-dom';
import home_img from "../../assets/images/home_dashboard.jpg";
import profile_img from "../../assets/images/Profile_dashboard.jpg";
import support_img from "../../assets/images/Support_dashboard.jpg";
import refer_img from "../../assets/images/Refer_dashboard.jpg";
import "./Footer.css"
export default function Footer(props) {
    const location = useLocation();
    const currentPath = location.pathname;
    const allowBottomBar = [
        '/dashboard',
        '/notification',
        '/support',
        '/refer'
    ];
    useEffect(() => { });
    return (
        allowBottomBar.indexOf(currentPath) > -1 ?
            <div className="row">
                <div className="container">
                    <div className="row fixed_menu nav-tab1">
                        <div className="col-lg-12 lft-ryt_padding pd_lft_rt">
                            <footer className="App-footer">
                                <div className="row nav-tab1">
                                    <div className="row bottomNav" align="center">
                                        <div className="col-3">
                                            <NavLink exact activeClassName="active" to='/dashboard' >
                                                <img src="images/home.png" className="img-fluid" />
                                                <img src="images/home_icon.png" className="img-fluid" />
                                                <p>Home</p>
                                            </NavLink>
                                        </div>
                                        <div className="col-3">
                                            <NavLink activeClassName="active" to='/notification' >
                                                <img src="images/active_bell.png" className="img-fluid" />
                                                <img src="images/notification.png" className="img-fluid" />
                                                <p>Notification</p>
                                            </NavLink>
                                        </div>
                                        <div className="col-3">
                                            <NavLink activeClassName="active" to='/refer' >
                                                <img src="images/refer.png" className="img-fluid" />
                                                <img src="images/refer.png" className="img-fluid" />
                                                <p>Refer</p>
                                            </NavLink>
                                        </div>
                                        <div className="col-3">
                                            <NavLink activeClassName="active" to='/support' >
                                                <img src="images/active_headphones.png" className="img-fluid" />
                                                <img src="images/headphones.png" className="img-fluid" />
                                                <p>Support</p>
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            </footer>
                        </div></div></div></div>
            : null
    )
}