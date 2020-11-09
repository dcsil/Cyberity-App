import React from 'react';
import 'react-vertical-timeline-component/style.min.css';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: "100%",
        margin: "2px",
    },
    paper: {
        textAlign: 'center',
        color: theme.palette.text.primary,
    },
}));

export default function EventLog(props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>{props.log ? props.log : null}</Paper>
            </Grid>
        </div>
    );
}

