import React from 'react';
import { VerticalTimeline } from 'react-vertical-timeline-component';
import UserTimelineElement from '../components/UserTimelineElement'
import 'react-vertical-timeline-component/style.min.css';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {Container } from '@material-ui/core';

export default class UserTimeline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            elements: []
        }
    }

    componentDidMount() {
        const interval = setInterval(() => {
            this.addUserThreat();
        }, 2000);
        return () => {
            clearInterval(interval)
        }
    }

    addUserThreat = () => {
        const elements = this.state.elements.slice();
        var currentdate = new Date();
        var datetime = "Last Sync: " + currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        let user = Math.random().toString(36).substring(7);
        let role = "Software Dev";
        elements.unshift(<UserTimelineElement role={role} user={user} date={datetime}></UserTimelineElement>);
        this.setState({
            elements: elements
        });
        console.log('Click');
    }

    render() {
        const elements = this.state.elements;
        return (
            <Container>
                <Card variant="outlined">
                <CardContent>
                    <VerticalTimeline >
                        {elements}
                    </VerticalTimeline>
                </CardContent>
            </Card>
            </Container>
            
        );
    }
}
