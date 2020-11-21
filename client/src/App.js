import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import SignIn from './pages/SignIn.js';
import SignUp from './pages/SignUp.js';
import Nav from './pages/Nav'
import { makeStyles } from '@material-ui/core/styles';
import PrivateRoute from './components/PrivateRoute'

const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    container: {
        display: "flex",
    }
}));

function App() {
    const classes = useStyles();
    return (
        <Router>
            <div data-testid="test-root-app" className={classes.container}>
                <Switch>
                    <Route exact path="/signin" component={SignIn} />
                    <Route exact path="/signup" component={SignUp} />
                    <Route exact path="/">
                        <Redirect to="/signin" />
                    </Route>
                    <PrivateRoute path="/app" component={Nav} />
                </Switch>
            </div>
        </Router>
    );
}
export default App;
