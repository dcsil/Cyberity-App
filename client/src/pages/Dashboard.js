import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TotalInsiderThreats from '../components/dashboard/TotalInsiderThreats.js'
import ContainedInsiderThreats from '../components/dashboard/ContainedInsiderThreats.js';
import LiveInsiderThreats from '../components/dashboard/LiveInsiderThreats.js';
import SecurityRating from '../components/dashboard/SecurityRating.js';
import TruePositives from '../components/dashboard/TruePositives.js';
import RecentInsiderThreat from '../components/dashboard/RecentInsiderThreat.js';
import InsiderThreatCalender from '../components/dashboard/InsiderThreatCalender.js';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    widget: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default function Dashboard() {
    const classes = useStyles();
    // Place all widgets here
    const widgets = [
        { xs: 4, key: "ContainedInsiderThreats", widget: <ContainedInsiderThreats /> },
        { xs: 4, key: "LiveInsiderThreats", widget: <LiveInsiderThreats /> },
        { xs: 4, key: "SecurityRating", widget: <SecurityRating /> },
        { xs: 12, key: "InsiderThreatCalender", widget: <InsiderThreatCalender /> },
        { xs: 3, key: "TotalInsiderThreats", widget: <TotalInsiderThreats /> },
        { xs: 3, key: "TruePositives", widget: <TruePositives /> },
        { xs: 6, key: "RecentInsiderThreat", widget: <RecentInsiderThreat /> },
    ].map((widget) =>
        <Grid key={widget.key} item xs={widget.xs}>{widget.widget}</Grid>
    );

    return (
        <div justify="space-evenly" className={classes.root}>
            <Grid container spacing={3}>
                {widgets}
            </Grid>
        </div>
    );
}