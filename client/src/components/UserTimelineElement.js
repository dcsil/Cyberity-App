import React from 'react';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';


export default function UserTimelineElement(props) {
    return (
        <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(46,46,51)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '12px solid  rgb(46,46,51)' }}
            date={props.date ? props.date : null}
            iconStyle={{ background: 'rgb(179,0,119)', color: '#fff'}}
            icon={<ErrorOutlineIcon fontSize='large' />}
        >
            <h3 className="vertical-timeline-element-title">{props.user ? props.user : "Anonymous"}</h3>
            <h4 className="vertical-timeline-element-subtitle">Role: {props.role ? props.role : "Unknown"}</h4>
            <p>
                Creative Direction, User Experience, Visual Design, Project Management, Team Leading
            </p>
        </VerticalTimelineElement>
    );
}

