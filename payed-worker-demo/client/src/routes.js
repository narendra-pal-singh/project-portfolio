import React from 'react' ;
import { BrowserRouter,Route,Switch,Redirect } from 'react-router-dom';
import SecureRoute from './session/SecureRoute';
import NotFound from './components/NotFound';
import SplashScreen from './components/SplashScreen';
import OnBoarding from './components/OnBoarding';
import UnlockApp from './components/UnlockApp';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import KYC from './components/KYC';
import AccountVerify from './components/KYC/AccountVerify';
import Support from './components/Support';
import Notification from './components/Notification';
import Refer from './components/Refer';
import Menu from './components/Dashboard/Menu';
import Transactions from './components/Dashboard/Transactions';
import Profile from './components/Dashboard/Profile';
import ViewProfile from './components/Dashboard/ViewProfile';
import Attendance from './components/Dashboard/Attendance';
export default ({props}) =>
<Switch>
    <Route exact path="/" component={SplashScreen} />
    <Route path="/unlock_app" component={UnlockApp} />
    <Route path="/logout" component={()=>{
        localStorage.clear();sessionStorage.clear();
        return <Redirect to="/" />
    }} />
    <Route path="/login" component={OnBoarding} />
    {/* <Route path="/login" component={(params)=>(<OnBoarding appProps={props} props={params} />)} /> */}
    <SecureRoute path="/basic_info" component={Registration} />
    <SecureRoute path="/dashboard" component={Dashboard} />
    {/* <Route path="/registration" component={Registration} /> */}
    {/* <Route path="/dashboard" component={DashBoard} /> */}
    <SecureRoute path="/account_verification" component={AccountVerify} />
    <SecureRoute path="/kyc" component={KYC} />
    <SecureRoute path="/support" component={Support} />
    <SecureRoute path="/notification" component={Notification} />
    <SecureRoute path="/refer" component={Refer} />
    <SecureRoute exact path="/menu" component={Menu} />
    <SecureRoute exact path="/menu/transactions" component={Transactions} />
    <SecureRoute exact path="/menu/profile" component={Profile} />
    <SecureRoute exact path="/menu/view_profile" component={ViewProfile} />
    <SecureRoute exact path="/menu/attendance" component={Attendance} />
    <Route component={NotFound} />
</Switch>
