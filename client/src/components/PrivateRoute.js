import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

function PrivateRoute(props) {
    const [pageStatus, setPageStatus] = useState({
        isLoading: true,
        isLoggedIn: false
    });

    useEffect(() => {
        console.log("Access private route");
        fetch('/api/checkauth', {
            method: "GET",
            headers: new Headers({
                "content-type": "application/json"
            })
        }).then(response => {
            if (response.status === 200) {
                setPageStatus(() => ({ isLoading: false, isLoggedIn: true }));
            } else {
                console.log(Cookies.get('csrf_access_token'))
                fetch('/api/refreshtoken/', {
                    method: "POST",
                    headers: new Headers({
                        "content-type": "application/json",
                        "X-CSRF-TOKEN": Cookies.get('csrf_access_token')
                    })
                }).then(response => {
                    console.log(response)
                    if (response.status !== 200) {
                        fetch('/api/logout', {
                            method: "POST",
                            headers: new Headers({
                                "content-type": "application/json"
                            })
                        }).then(response => {
                            console.log("Refresh token expired");
                            setPageStatus(() => ({ isLoading: false, isLoggedIn: false }));
                        })
                    } else {
                        console.log("refresh new access token");
                        setPageStatus(() => ({ isLoading: false, isLoggedIn: true }));
                    }
                })
            }
        }).catch((error) => {
            console.log("NOT WORKING")
        })
    }, []);


    return pageStatus.isLoading ? null :
        pageStatus.isLoggedIn ?
            <Route path={props.path} component={props.component} exact={props.exact} /> :
            <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />
}
export default PrivateRoute;