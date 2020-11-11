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
    paper: {
        padding: theme.spacing(1),
        textAlign: 'left',
        flexGrow: 1,
        marginTop: "5px",
        marginBottom: "5px"
      },
    link: {
        textDecoration: 'none'
    }
}));


export default function PriorityInsiderThreat() { 
    const classes = useStyles();
    const [criticalThreats, setCriticalThreats] = useState("F");
    const [highThreats, SetHighThreats] = useState("F");
    const [lowThreats, setLowThreats] = useState("F");

    


    return (
        <Paper varient="elevation" className={classes.card}>
            <Paper variant="outlined" className={classes.paper}>
                <Typography component="h1" variant="h5">
                    {/*securityRating*/}
                    Critical
                </Typography>
            </Paper>
            <Paper variant="outlined" className={classes.paper}>
                <Typography component="h1" variant="h5">
                    {/*securityRating*/}
                    High Priority
                </Typography>
            </Paper>
            <Paper variant="outlined" className={classes.paper}>
                <Typography component="h1" variant="h5">
                    {/*securityRating*/}
                    Low Priority
                </Typography>
            </Paper>
        </Paper>
    );
}