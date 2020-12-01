import React, { useState, useEffect } from 'react';
import { VerticalTimeline } from 'react-vertical-timeline-component';
import UserTimelineElement from '../components/UserTimelineElement'
import 'react-vertical-timeline-component/style.min.css';
import { Paper } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        position:"fixed"
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: "wrap"
    },
    legendHeader: {
        display: "flex",
        justifyContent: "flex-center"
    },
}));

export default function UserTimeline() {
    const classes = useStyles();
    const [userTimelineElements, setUserTimelineElements] = useState([])

    useEffect(() => {
        fetch('/api/getAllThreats/' + 50, {
            method: 'GET',
            headers: new Headers({
                "content-type": "application/json",
            })
        })
            .then(response => response.json())
            .then(data => {
                const elements = data.map((userdata) => <UserTimelineElement
                    key={userdata["_id"]["$oid"]}
                    role={userdata["role"]}
                    user={userdata["name"]}
                    date={(new Date(userdata["detectionDate"]["$date"])).toString()}
                    status={userdata["status"]}>
                </UserTimelineElement>)
                setUserTimelineElements(elements)
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    return (
        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={10}>
                <VerticalTimeline >
                    {userTimelineElements}
                </VerticalTimeline>
            </Grid>
            <Grid item xs={2}>
                <Paper className={classes.paper}>
                    <Grid container spacing={1}>
                        <Grid className={classes.legendItem} item xs={12}>
                            <CheckCircleOutlineIcon style={{ fontSize: 50, color: "rgb(126, 201, 105)" }}></CheckCircleOutlineIcon>
                            <Typography display="inline" >Contained</Typography>
                        </Grid>
                        <Grid className={classes.legendItem} item xs={12}>
                            <CancelOutlinedIcon style={{fontSize: 50, color: "rgb(204, 104, 106)" }} />
                            <Typography display="inline" >False Threat</Typography>
                        </Grid>
                        <Grid className={classes.legendItem} item xs={12}>
                            <HelpOutlineOutlinedIcon style={{fontSize: 50, color: "rgb(179,0,119)" }} />
                            <Typography display="inline" >Threat</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}
