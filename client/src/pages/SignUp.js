import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CyberityLogo from '../assets/logo_cyberity_text.png';
import { Link } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: `url(${CyberityLogo})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        width: "70%",
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: "30%"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    auth: {
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    }
}));

export default function SignUp() {
    const classes = useStyles();
    const history = useHistory();
    const [userSignUpInfo, setUserSignUpInfo] = useState({
        "username": "",
        "password": "",
        "name": "",
        "email": ""
    });

    function register() {
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

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} className={classes.auth} elevation={6} square>
                <Container component="main">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h4">
                            Sign up
        </Typography>
                        <form className={classes.form} noValidate>
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
                                        type="submit"
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
