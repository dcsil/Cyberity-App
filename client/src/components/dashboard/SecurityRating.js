import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    card: {
        padding: theme.spacing(2),
        textAlign: 'center',
        userSelect: 'none',
        flexGrow: 1,
    },
}));

export default function SecurityRating() {
    const classes = useStyles();
    const [securityRating, setSecurityRating] = useState("F");

    useEffect(() => {
        fetch('/api/securityRating', {
            method: 'GET',
            headers: new Headers({
                "content-type": "application/json",
            })
        })
            .then(response => response.json())
            .then(data => setSecurityRating(data))
            .catch(err => {
                console.log(err)
            })
    }, []);

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