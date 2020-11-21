import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const useStyles = makeStyles((theme) => ({
    card: {
        padding: theme.spacing(2),
        textAlign: 'center',
        flexGrow: 1,
        height: '100%',
        width: '100%'
    },
    progressBarHolder: {
        height: '100%',
        width: '73%',
        padding: theme.spacing(2),
        textAlign: 'center',
        flexGrow: 1,
        alignContent: 'center',
        alignItems: 'center',
        margin: "auto",
    }
}));


export default function TruePositives() {
    const classes = useStyles();
    const [truePositiveRate, setTruePositiveRate] = useState();

    useEffect(() => {
        fetch('/api/truePositiveRate', {
            method: 'GET',
            headers: new Headers({
                "content-type": "application/json",
            })
        })
            .then(response => response.json())
            .then(data => setTruePositiveRate(Math.floor(data * 100)))
            .catch(err => {
                console.log(err)
            })
    }, [truePositiveRate]);

    return (
        <Paper varient="elevation" className={classes.card}>
            <Typography component="h1" variant="h5">
                True Positives
            </Typography>
            <div className={classes.progressBarHolder}>
                <CircularProgressbar
                    value={truePositiveRate}
                    text={`${truePositiveRate}%`}
                    styles={buildStyles({
                        strokeLinecap: 'butt',
                        textSize: '200%',
                        pathTransitionDuration: 0.5,
                        pathColor: '#913973',
                        textColor: 'white',
                        backgroundColor: '#3e98c7',
                    })} />
            </div>

        </Paper>
    );
}
