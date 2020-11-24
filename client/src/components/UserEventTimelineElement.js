import React from 'react';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import EventLog from './EventLog.js'
import 'react-vertical-timeline-component/style.min.css';
import EventIcon from '@material-ui/icons/Event';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

export default function UserEventTimelineElement(props) {
    const classes = useStyles();

    const eventLogs = props.eventLogs ? props.eventLogs.map(eventLog => <EventLog log={eventLog}></EventLog>) : [];

    return (
        <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(46,46,51)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '12px solid  rgb(46,46,51)' }}
            date={props.date ? props.date : null}
            iconStyle={{ background: "rgb(187,134,252)", color: '#fff' }}
            icon={<EventIcon fontSize='large' />}
            position="right"
        >
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h3 className="vertical-timeline-element-title">{props.eventType ? props.eventType : "Unknown Event"}</h3>
                    </Grid>
                    {eventLogs}
                </Grid>
            </div>
        </VerticalTimelineElement>
    );
}

