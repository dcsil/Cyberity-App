import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TotalInsiderThreats from '../components/dashboard/TotatInsiderThreats.js'
import ContainedInsiderThreats from '../components/dashboard/ContainedInsiderThreats.js';
import LiveInsiderThreats from '../components/dashboard/LiveInsiderThreats.js';
import SecurityRating from '../components/dashboard/SecurityRating.js';
import TruePositives from '../components/dashboard/TruePositives.js';

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
        {xs:'3', widget: <TotalInsiderThreats/>},
        {xs:'3', widget: <ContainedInsiderThreats/>},
        {xs:'3', widget: <LiveInsiderThreats/>},
        {xs:'3', widget: <SecurityRating/>},
        {xs:'3', widget: <TruePositives/>},
    ].map((widget) => 
        <Grid item xs={widget.xs}>{widget.widget}</Grid>
    );
  
    return (
      <div  justify="space-evenly" className={classes.root}>
        <Grid alignItems="center" alignContent="center" container spacing={3}>
            {widgets}
        </Grid>
      </div>
    );
  }