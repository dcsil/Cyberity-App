import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router-dom";
import {AuthPageStyles} from "../Styles.js";

export default function SignIn() {
    const classes = AuthPageStyles();
    const history = useHistory();
    const [userSignInInfo, setUserSignInInfo] = useState({
        "username": "",
        "password": "",
    });

    function login(event) {
        event.preventDefault();
        fetch('/api/login', {
            method: "POST",
            body: JSON.stringify(userSignInInfo),
            headers: new Headers({
                "content-type": "application/json"
            })
        }).then(response => {
            if (response.status === 403) {
                alert("Incorrect Credentials");
            } else if (response.status === 200) {
                response.json().then(data => {
                    history.push("/app/dashboard")
                });
            }
        }).catch((error) => {
            console.log(error)
        });
    }

    useEffect(() => {
        fetch('/api/checkauth', {
            method: "GET",
            headers: new Headers({
                "content-type": "application/json"
            })
        }).then(response => {
            if (response.status === 200) {
                history.push("/app/dashboard")
            }
        }).catch((error) => {
            console.log("NOT WORKING")
        })
    },[history]);

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} className={classes.auth} elevation={6} square="true">
                <Container component="main">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h4">
                            Sign In
            </Typography>
                        <form className={classes.form} onSubmit={login} noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                onChange={event => {
                                    const { value } = event.target;
                                    setUserSignInInfo(Object.assign(userSignInInfo, { "username": value }));
                                }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={event => {
                                    const { value } = event.target;
                                    setUserSignInInfo(Object.assign(userSignInInfo, { "password": value }));
                                }}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={login}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                </Grid>
                                <Grid item>
                                    <Button
                                        fullWidth
                                        className={classes.submit}
                                        component={Link}
                                        to="/signup"
                                    >
                                        Don't have an account? Sign up!
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Container>
            </Grid>
        </Grid>
    );
}
