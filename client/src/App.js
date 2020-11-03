import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import Login from './pages/Login.js';
import Nav from './pages/Nav'
import { makeStyles } from '@material-ui/core/styles';

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
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/">
                        <Redirect to="/login"/>
                    </Route>
                    <Route path="/app" component={Nav} />
                </Switch>
            </div>
        </Router>
    );
}
export default App;
