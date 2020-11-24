import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import UserEventTimelineElement from '../components/UserEventTimelineElement'
import 'react-vertical-timeline-component/style.min.css';

import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CardContent from '@material-ui/core/CardContent';
import { Button, Container } from '@material-ui/core';
import { withRouter } from "react-router-dom";

class UserTimeline extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props.match.params);
        this.state = {
            elements: [],
            user: this.props.match.params.user
        }
    }

    componentDidMount() {
        const interval = setInterval(() => {
            this.addUserEventTimeline();
        }, 2000);
        return () => {
            clearInterval(interval)
        }
    }

    addUserEventTimeline = () => {
        const elements = this.state.elements.slice();
        var currentdate = new Date();
        var datetime = "Last Sync: " + currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        elements.unshift(<UserEventTimelineElement date={datetime} eventType="Authentication" eventLogs={["Login failed", "Login passed", "ok"]}></UserEventTimelineElement>
        );
        this.setState({
            elements: elements
        });
    }

    render() {
        const elements = this.state.elements;
        const user = this.state.user;
        const threatDetectedTime = "THIS TIME";
        return (
            <Container>
                <Card variant="outlined">
                    <CardContent>
                        <h3 className="vertical-timeline-element-title">User: {user ? user : "Anonymous"}</h3>
                        <div>
                            <Grid container spacing={3}>
                                <Grid item>
                                    <Button color="primary" variant="contained">Profile</Button>
                                </Grid>
                            </Grid>
                        </div>
                    </CardContent>
                </Card>
                <VerticalTimeline >
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: 'rgb(255,46,51)', color: '#fff' }}
                        contentArrowStyle={{ borderRight: '12px solid  rgb(46,46,51)' }}
                        date={threatDetectedTime}
                        iconStyle={{ background: 'rgb(179,0,119)', color: '#fff' }}
                        icon={<ErrorOutlineIcon fontSize='large' />}
                        position="left"
                    >
                        <h3 className="vertical-timeline-element-title">{user ? user : "Anonymous"}</h3>
                        <h4 className="vertical-timeline-element-subtitle"> Threat detected</h4>
                    </VerticalTimelineElement>
                    {elements}
                </VerticalTimeline>
            </Container>
        );
    }
}

export default withRouter(UserTimeline);