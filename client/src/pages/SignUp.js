import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router-dom";
import {AuthPageStyles} from "../Styles.js";


export default function SignUp() {
    const classes = AuthPageStyles();
    const history = useHistory();
    const [userSignUpInfo, setUserSignUpInfo] = useState({
        "username": "",
        "password": "",
        "name": "",
        "email": ""
    });

    function register(event) {
        event.preventDefault();
        console.log(userSignUpInfo)
        fetch('/api/register', {
            method: "POST",
            body: JSON.stringify(userSignUpInfo),
            headers: new Headers({
                "content-type": "application/json"
            })
        }).then(response => {
            if (response.status === 422) {
                alert("Missing Information");
            } else if (response.status === 403) {
                alert("Username Already Exists");
            } else if (response.status === 201) {
                alert("Account Successfully Created")
                history.push("/signin");
            }
            //history.push("/signin")
        }).catch((error) => {
            console.log(error)
        })
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
                            Sign up
                        </Typography>
                        <form className={classes.form} noValidate onSubmit={register}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        autoComplete="fname"
                                        name="Full Name"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="fullName"
                                        label="Full Name"
                                        autoFocus
                                        onChange={event => {
                                            const { value } = event.target;
                                            setUserSignUpInfo(Object.assign(userSignUpInfo, { "name": value }));
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        onChange={event => {
                                            const { value } = event.target;
                                            setUserSignUpInfo(Object.assign(userSignUpInfo, { "email": value }));
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="username"
                                        label="Username"
                                        type="username"
                                        id="username"
                                        autoComplete="current-username"
                                        onChange={event => {
                                            const { value } = event.target;
                                            setUserSignUpInfo(Object.assign(userSignUpInfo, { "username": value }));
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        onChange={event => {
                                            const { value } = event.target;
                                            setUserSignUpInfo(Object.assign(userSignUpInfo, { "password": value }));
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={register}
                            >
                                Sign Up
                            </Button>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Button
                                        fullWidth
                                        className={classes.submit}
                                        component={Link}
                                        to="/signin"
                                    >
                                        Have an account? Sign In!
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
