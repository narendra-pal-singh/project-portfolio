import React, { Component } from 'react'
import cong_logo from '../assets/images/success.png';
import sorry_logo from '../assets/images/error.png';

export default function index(props) {

    const { show, success, content } = props.data;

    const title = success === true ? 'Congratulations!' : 'Sorry!';
    const popup_img = success === true ? cong_logo : sorry_logo;


    if (show == true) {

        return (
            <div>
                <div>
                    <div className="popupBgselfie"></div>
                    <div className="popupBodyselfie">
                        <div className="col-lg-12 yauto">
                            <center>
                                <img src={popup_img} className="img-fluid step_img" />
                                <p className="step_text">{title}</p>
                                <p className="input_head_p">{content}</p>
                                <button className="btn app_btn" onClick={props.closePopUP}>OK</button>
                            </center>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return null;
    }

}
