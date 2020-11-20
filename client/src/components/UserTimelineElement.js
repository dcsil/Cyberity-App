import React from 'react';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles} from '@material-ui/core/styles';

import {Link} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      width: '100%',/* Magic here */
    },
  }));

export default function UserTimelineElement(props) {
    const classes = useStyles();
    
    return (
        <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(66,66,66)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '12px solid  rgb(66,66,66)' }}
            date={props.date ? props.date : null}
            iconStyle={{ background: 'rgb(179,0,119)', color: '#fff'}}
            icon={<ErrorOutlineIcon fontSize='large' />}
        >
            <h3 className="vertical-timeline-element-title">{props.user ? props.user : "Anonymous"}</h3>
            <h4 className="vertical-timeline-element-subtitle">Role: {props.role ? props.role : "Unknown"}</h4>
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item>
                        <Button color="primary" variant="contained">Profile</Button>
                    </Grid>
                    <Grid item>
                        <Button component={Link} to={"/app/usereventtimeline/" + props.user} color="primary" variant="contained">Event Timeline</Button>
                    </Grid>
                </Grid>
            </div>
            
        </VerticalTimelineElement>
    );
}

