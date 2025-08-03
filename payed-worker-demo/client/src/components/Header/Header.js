import React, { useEffect, useState } from 'react'
import { useLocation, useHistory, Redirect } from 'react-router-dom';
import { getUser } from '../../session/Control';
import { isPINSet, isUnLockAPP, getToken, getCurrentScreen } from "./../../session/Control";
import { pagesData } from '../../data/AppData';
import { CONFIG } from '../../data/Config';
import { getUserData } from '../../services/UserAPI';
import backIcon from '../../assets/images/backIcon.png'
import './Header.css'
export default function Header(props) {
    const [userData, setUserData] = useState(null);
    const location = useLocation();
    const currentPath = location.pathname;
    const allowBack = ['kyc', 'account_verification'];
    useEffect(() => {
    });
    let headerImage = 'logo.png';
    let logoTitle = '';
    if (pagesData[currentPath]) {
        if (pagesData[currentPath].headerImg !== "")
            headerImage = pagesData[currentPath].headerImg;
        if (pagesData[currentPath].logoTitle !== "")
            logoTitle = pagesData[currentPath].logoTitle;
    }
    let history = useHistory();
    return (
        currentPath === '/dashboard' || currentPath === '/support' || currentPath === '/notification' || currentPath === '/refer' || currentPath === '/login/welcome' || currentPath.split('/')[1] === 'menu' ?
            currentPath.split('/')[1] === 'menu' && currentPath.split('/').length > 2 && currentPath.split('/')[2] !== "" ?
                <div className="menu-header" style={{ textAlign: "center", height: "50px", margin: "10px 0", padding: "10px 0" }}>
                    <div className="topBackBtn" onClick={() => history.goBack()}><img src={backIcon} alt=" Back Nav" /></div>
                    {/* <div>Page title</div> */}
                </div>
                : null
            :
            <div className="row">
                <div className="container">
                    <div className="col-lg-12 pd_lft_rt">

                        <div className="row logo_bg_none">
                            {
                                allowBack.indexOf(currentPath.split('/')[1]) > -1 ?
                                    <div className="topBackBtn" onClick={() => history.goBack()}><img src={backIcon} alt=" Back Nav" /></div>
                                    :
                                    null
                            }

                            <div className="col-lg-12 pd_lft_rt mob_lft_ryt">
                                <center>
                                    {
                                        currentPath === "/" ?
                                            (<div>
                                                <img src="/images/logo.png" className="img-fluid logo_wdth" />
                                            </div>)
                                            :
                                            (<div>
                                                <IMAGE icon={headerImage} />
                                                {
                                                    logoTitle !== '' ?
                                                        <p className="step_text">{logoTitle}</p>
                                                        : null
                                                }
                                            </div>)
                                    }
                                </center>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
    )
}
const IMAGE = ({ icon }) => {
    console.log('IMAGE ICON', icon);
    return <img src={require('./../../assets/images/' + icon).default} className="img-fluid logo_wdth imgIcon" />
}