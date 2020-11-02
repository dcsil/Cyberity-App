import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import Login from './pages/Login.js';

import Navbar from './pages/Navbar'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    container: {
        display: "flex"
    }
}));

function App() {
    const classes = useStyles();
    return (
        <Router>
            <div className={classes.container}>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/">
                        <Redirect to="/login"/>
                    </Route>
                    <Route path="/app" component={Navbar} />
                </Switch>
            </div>

        </Router>
    );
}


export default App;
