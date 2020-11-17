import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {checkAuth} from '../util/auth.js';

function PrivateRoute({ component: Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          checkAuth() ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/signin",
              }}
            />
          )
        }
      />
    );
  }
export default PrivateRoute;