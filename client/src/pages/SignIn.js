import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CyberityLogo from '../assets/logo_cyberity_text.png';
import Paper from '@material-ui/core/Paper';
import {Link} from 'react-router-dom';
import Container from '@material-ui/core/Container';

  
  const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
      },
      image: {
        backgroundImage: `url(${CyberityLogo})` ,
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
  }));
  
  export default function SignInSide() {
    const classes = useStyles();
  
    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5}  component={Paper} elevation={6} square>
        <Container component="main">
        <CssBaseline />

          <div className={classes.paper}>
          <Typography component="h1" variant="h4">
              Sign In
            </Typography>
            <form className={classes.form} noValidate>
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
                component={Link}
                to="/app/dashboard"
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                    </Grid>
                        <Grid item>
                            <Button
                            type="submit"
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
