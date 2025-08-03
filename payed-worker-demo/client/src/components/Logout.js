import React, { Component } from 'react'

export default class Logout extends Component {

    componentDidMount(){
        
        
        localStorage.clear();
        sessionStorage.clear();
        //alert('logout');
        this.props.history.push('/');

    }

    render() {
        return (
            <div>
                Logged
                <ul>
                    <li>Device 1</li>
                    <li>Device 2</li>
                </ul>
            </div>
        )
    }
}
