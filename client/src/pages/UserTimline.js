import React, { useState, useEffect } from 'react';
import { VerticalTimeline } from 'react-vertical-timeline-component';
import UserTimelineElement from '../components/UserTimelineElement'
import 'react-vertical-timeline-component/style.min.css';
import {Container } from '@material-ui/core';
import { getAuthTokenHeaderValue } from "../util/auth"

export default function UserTimeline() {
    const [userTimelineElements, setUserTimelineElements] = useState([])
    useEffect(() => {
        // TODO: SORT THEM BY 
        fetch('/api/getAllThreats/' + 50, {
            method: 'GET',
            headers: new Headers({
                "content-type": "application/json",
                "Authorization": getAuthTokenHeaderValue(),
            })
        })
            .then(response => response.json())
            .then(data => {
                const elements = data.map((userdata) => <UserTimelineElement role={userdata["role"]} user={userdata["name"]} date={userdata["detectionDate"]} status={userdata["status"]}></UserTimelineElement>)
                setUserTimelineElements(elements)
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    return (
        <Container>
            <VerticalTimeline >
                {userTimelineElements}
            </VerticalTimeline>
        </Container>
    );
}
