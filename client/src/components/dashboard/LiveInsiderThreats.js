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


export default function LiveInsiderThreats() { 
    const classes = useStyles();
    const [liveInsiderThreats, setLiveInsiderThreats] = useState(24);
    const [shadow, setShadow] = useState(0);

    useEffect(() => {
        // Initial Fetch of data
        // Fetch data every few seconds
        const interval = setInterval(() => {
            setLiveInsiderThreats(liveInsiderThreats => liveInsiderThreats + 1);
        }, 1000);
        return () => {
            clearInterval(interval)
        }
    },[]);

    return (
        <Link to="/app/insiderthreats" className={classes.link}>
        <Paper varient="elevation" onMouseOut={() => setShadow(0)} onMouseOver={() => setShadow(24)} elevation={shadow} className={classes.card}>
            <Typography component="h1" variant="h5">
                Live Threats
            </Typography>
            <Paper variant="outlined">
                <Typography component="h1" variant="h3">
                    {liveInsiderThreats}
                </Typography>
            </Paper>
        </Paper>
        </Link>
    );
}
