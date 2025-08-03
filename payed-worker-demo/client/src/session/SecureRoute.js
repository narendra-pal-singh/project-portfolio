import React from 'react'
import {Route,Redirect } from 'react-router-dom';
import {isPINSet, isUnLockAPP, getToken } from "./Control";

export default function SecureRoute({component: Component, ...rest }) {
    return (
        <Route
        {...rest}
            render={props => {

                if(isPINSet() != null & isUnLockAPP() == null){
                    return <Redirect to={{pathname: "/unlock_app",state:{froms: props.location}}} />
                }else{

                return getToken()!=null ? 
                <Component {...props} />
                : <Redirect to={{pathname: "/login",state:{froms: props.location}}} />

                }
            }}
        />
    )
}


// export const PublicRoute = ({ auth, ...props }) => {
//     const isAllowed = auth.isLoggedIn();
//     return isAllowed
//         ? (<Redirect to="/dashboard" />)
//         : (<Route {...props} />)
// };

// export const ProtectedRoute =  ({ auth, ...props }) => {
//     const isAllowed = auth.isLoggedIn();
//     return isAllowed
//         ? (<Route {...props} />)
//         : (<Redirect to="/login" />)
// };
