import React, { Component } from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import AddHomeScreen from './common/AddHomeScreen';
import Footer from "./components/Footer/Footer";
import Header from './components/Header/Header';
import Routes from './routes';
export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    }
  }
  componentDidMount(){ }
    render() {
    return (
      <div className="home">
        <Router>
          <Header/>
          <div className="body_content" style={{minHeight:'60%'}}>
            <div className="row">
              <div className="container">
                <div className="col-lg-12 pd_lft_rt">
                  <Routes props={this}/>
                </div>
              </div>
            </div>
          </div>
          <Footer/>
        <AddHomeScreen/>
        </Router>
      </div>
    )
  }
}