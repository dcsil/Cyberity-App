import React, {useState, useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    card: {
      padding: theme.spacing(2),
      textAlign: 'center',
      userSelect: 'none',
      flexGrow: 1,
    },
    link: {
        textDecoration: 'none'
    }
}));


export default function SecurityRating() { 
    const classes = useStyles();
    const [securityRating, setSecurityRating] = useState("F");

    useEffect(() => {
        // Initial Fetch of data
        // Fetch data every few seconds
        const interval = setInterval(() => {
            setSecurityRating("A");
        }, 1000);
        return () => {
            clearInterval(interval)
        }
    },[]);

    return (
        <Paper varient="elevation" className={classes.card}>
            <Typography component="h1" variant="h5">
                Security Rating
            </Typography>
            <Paper variant="outlined">
                <Typography component="h1" variant="h3">
                    {securityRating}
                </Typography>
            </Paper>
        </Paper>
    );
}