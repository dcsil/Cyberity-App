import React, {useState, useEffect} from 'react';
import { VerticalTimeline } from 'react-vertical-timeline-component';
import UserTimelineElement from '../components/UserTimelineElement'
import 'react-vertical-timeline-component/style.min.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Container } from '@material-ui/core';
import {getAuthTokenHeaderValue} from "../util/auth"

export default function UserTimeline() {
    const [userTimelineElements, setUserTimelineElements] = useState([])

    useEffect(() => {
        // TODO: SORT THEM BY 
        fetch('/api/getAllThreats', {
            method: 'GET',
            headers: new Headers({
                "content-type": "application/json",
                "Authorization": getAuthTokenHeaderValue(),
            })
        })
            .then(response => response.json())
            .then(data => {
                const elements = data.map((userdata) => <UserTimelineElement role={userdata["role"]} user={userdata["name"]} date={userdata["detectionDate"]} flagged={userdata["detectionDate"]}></UserTimelineElement>)
                setUserTimelineElements(elements)
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    return (
        <Container>
            <Card variant="outlined">
                <CardContent>
                    <VerticalTimeline >
                        {userTimelineElements}
                    </VerticalTimeline>
                </CardContent>
            </Card>
        </Container>
    );
}
