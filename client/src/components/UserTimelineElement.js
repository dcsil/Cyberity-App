import React from 'react';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';

const statusIcon = (status) => {
    switch (status) {
        case "active":
            return <ErrorOutlineIcon fontSize='large' />
        case "contained":
            return <CheckCircleOutlineIcon fontSize='large' />
        case "false":
            return <CancelOutlinedIcon fontSize='large' />
        default:
            return <HelpOutlineOutlinedIcon fontSize='large' />
    }
}

const statusIconColor = (status) => {
    switch (status) {
        case "active":
            return { background: 'rgb(179,0,119)', color: '#fff' }
        case "contained":
            return { background: 'rgb(126, 201, 105)', color: '#fff' }
        case "false":
            return { background: 'rgb(204, 104, 106)', color: '#fff' }
        default:
            return { background: 'rgb(179,0,119)', color: '#fff' }
    }
}

export default function UserTimelineElement(props) {
    return (
        <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(66,66,66)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '12px solid  rgb(66,66,66)' }}
            date={props.date ? props.date : null}
            iconStyle={statusIconColor(props.status)}
            icon={statusIcon(props.status)}
        >
            <h1 className="vertical-timeline-element-title">{props.user ? props.user : "Anonymous"}</h1>
            <h4 className="vertical-timeline-element-subtitle">Email: {props.email ? props.email : "Unknown"}</h4>
            <h4 className="vertical-timeline-element-subtitle">Role: {props.role ? props.role : "Unknown"}</h4>
            <h4 className="vertical-timeline-element-subtitle">Department: {props.department ? props.department : "Unknown"}</h4>

        </VerticalTimelineElement>
    );
}

