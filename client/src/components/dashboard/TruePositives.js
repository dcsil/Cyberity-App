import React, {useState, useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgressbar, buildStyles  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const useStyles = makeStyles((theme) => ({
    card: {
      padding: theme.spacing(2),
      textAlign: 'center',
      userSelect: 'none',
      flexGrow: 1,
      height: '100%',
      width: '100%'
    },
}));


export default function TruePositives() { 
    const classes = useStyles();
    const [truePositiveRate, setTruePositiveRate] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if(truePositiveRate >= 100){
                setTruePositiveRate(0);
            }else{
                setTruePositiveRate(truePositiveRate => truePositiveRate + 10);
            }
        }, 1000);
        return () => {
            clearInterval(interval)
        }
    },[truePositiveRate]);

    return (
        <Paper varient="elevation" className={classes.card}>
            <Typography component="h1" variant="h5">
                True Positives
            </Typography>
            <Paper variant="outlined" style={{padding:"5%"}}>
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
                })}/>
            </Paper>
        </Paper>
    );
}
