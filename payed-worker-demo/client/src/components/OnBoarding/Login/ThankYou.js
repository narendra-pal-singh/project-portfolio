import React, { Component } from 'react'
import { API_ROUTE, CONFIG } from "../../../data/Config"
export default class ThankYou extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Timer: CONFIG.REDIRECT_TIMER
        }
        this.startTimer = null
    }
    componentDidMount() {
        //alert(this.props.location.pathname);
        this.startTime();
    }
    componentWillUnmount() {
        clearInterval(this.startTimer);
    }
    startTime = () => {
        this.startTimer = setInterval(this.countDown, 1000);
    }
    countDown = () => {

        let seconds = this.state.Timer - 1;

        this.setState({
            Timer: seconds,
        });

        if (seconds == 0) {
            clearInterval(this.startTimer);
            this.props.redirectPage('/');
        }
    }
    render() {

        const { Timer } = this.state;

        return (
            <div>
                <p className="head_text">
                    <strong>Thank you</strong>
                </p>
                <div className="input_div">
                    <p>
                        Thank you for expressing interest on Pay'ed. Unfortunately your company is not onboarded with us yet.
                        Please get in touch with your HR for onboarding.
                    </p>
                </div>
                <p>
                    {Timer}
                </p>
            </div>
        )
    }
}
