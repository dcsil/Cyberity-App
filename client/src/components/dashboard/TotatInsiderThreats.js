import React, {useState, useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';

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


export default function TotalInsiderThreats() { 
    const classes = useStyles();
    const [totalInsiderThreats, setTotalInsiderThreats] = useState(1923);
    const [shadow, setShadow] = useState(0);

    useEffect(() => {
        // Initial Fetch of data
        // Fetch data every few seconds
        const interval = setInterval(() => {
            setTotalInsiderThreats(totalInsiderThreats => totalInsiderThreats + 2);
        }, 1000);
        return () => {
            clearInterval(interval)
        }
    },[]);

    return (
        <Link to="/app/insiderthreats" className={classes.link}>
        <Paper varient="elevation" onMouseOut={() => setShadow(0)} onMouseOver={() => setShadow(24)} elevation={shadow} className={classes.card}>
            <Typography component="h1" variant="h5">
                Total Insider Threats
            </Typography>
            <Paper variant="outlined">
                <Typography component="h1" variant="h3">
                    {totalInsiderThreats}
                </Typography>
            </Paper>
        </Paper>
        </Link>
    );
}
