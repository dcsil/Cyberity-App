import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoute(props) {
    const [pageStatus, setPageStatus] = useState({
        isLoading: true,
        isLoggedIn: false
    });

    useEffect(() => {
        fetch('/api/checkauth', {
            method: "GET",
            headers: new Headers({
                "content-type": "application/json"
            })
        }).then(response => {
            if (response.status === 200) {
                setPageStatus(() => ({ isLoading: false, isLoggedIn: true }));
            } else {
                fetch('/api/logout', {
                    method: "POST",
                    headers: new Headers({
                        "content-type": "application/json"
                    })
                }).then(response => {
                    setPageStatus(() => ({ isLoading: false, isLoggedIn: false }));
                })
            }
        }).catch((error) => {
            console.log("NOT WORKING")
        })
    }, [props.location]);


    return pageStatus.isLoading ? null :
        pageStatus.isLoggedIn ?
            <Route path={props.path} component={props.component} exact={props.exact} /> :
            <Redirect to={{pathname: '/signin',state: {from: props.location}}}/>
}
export default PrivateRoute;