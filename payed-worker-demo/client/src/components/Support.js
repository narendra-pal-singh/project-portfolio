import React, { Component } from 'react'

import {getUser} from '../session/Control';

import './Support.css';



export default class Support extends Component {

    

    render() {
        
        const userData = getUser();

        //console.log('userData=',userData.first_name);

        return (
            <div className="col-lg-12 support">
                <div className="row mrgn_zero">
                    <div className="col-lg-12 pd_lft_rt">
                        <center>
                            <img src="images/headphone_icon.png" className="img-fluid support_icon_width1" />
                            <p className="step_text">Support</p>
                            <p className="head_text">
                                <strong>Hello {userData.first_name},</strong>
                                </p>
                            <p className="qus">Do you have any questions? </p>
                            <p className="pls">
                               Please contact us at:
                            </p>
                            <div className="support_div">
                                <p><a href="#"><img src="images/support_mail.png" className="img-fluid support_icon_width" /> <span>support @payed.com</span></a></p>
                                <p><a href="#"><img src="images/mob_icon.png" className="img-fluid mob_icon_width" /> <span>9500003340</span></a></p>
                                <p><a href="#"><img src="images/wtsp_icon.png" className="img-fluid wtsp_icon_width" /> <span>9599993391</span></a></p>
                            </div>
                        </center>
                    </div>
                </div>
            </div>
        )
    }
}
