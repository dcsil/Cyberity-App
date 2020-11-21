import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ResponsivePie } from '@nivo/pie'
import { Link } from 'react-router-dom';
import {getAuthTokenHeaderValue} from "../../util/auth"

const useStyles = makeStyles((theme) => ({
    card: {
        padding: theme.spacing(2),
        textAlign: 'center',
        userSelect: 'none',
        flexGrow: 1,
        height: "100%",
        width: "100%"
    },
    link: {
        textDecoration: 'none'
    }
}));


export default function TotalInsiderThreats() {
    const classes = useStyles();
    const [totalInsiderThreats, setTotalInsiderThreats] = useState(0);
    const [threatData, setThreatData] = useState([
        {
            "id": "Contained",
            "label": "Contained",
            "value": 1,
            "color": "hsl(21, 70%, 50%)"
        },
        {
            "id": "Live",
            "label": "Live",
            "value": 1,
            "color": "hsl(152, 70%, 50%)"
        },
        {
            "id": "False",
            "label": "False",
            "value": 90,
            "color": "hsl(152, 70%, 50%)"
        },
    ]);
    const [shadow, setShadow] = useState(0);

    const theme = {
        axis: {
            fontSize: "14px",
            tickColor: "#eee",
            ticks: {
                line: {
                    stroke: "#555555"
                },
                text: {
                    fill: "#ffffff"
                }
            },
            legend: {
                text: {
                    fill: "#aaaaaa"
                }
            }
        },
        grid: {
            line: {
                stroke: "#555555"
            }
        }
    };

    useEffect(() => {
        Promise.all([
            fetch('/api/numContainedThreats', {
                method: 'GET',
                headers: new Headers({
                    "content-type": "application/json",
                    "Authorization": getAuthTokenHeaderValue(),
                })
            }),
            fetch('/api/numActiveThreats', {
                method: 'GET',
                headers: new Headers({
                    "content-type": "application/json",
                    "Authorization": getAuthTokenHeaderValue(),
                })
            }),
            fetch('/api/numFalseThreats', {
                method: 'GET',
                headers: new Headers({
                    "content-type": "application/json",
                    "Authorization": getAuthTokenHeaderValue(),
                })
            })
        ]).then(function (responses) {
            // Get a JSON object from each of the responses
            return Promise.all(responses.map(function (response) {
                return response.json();
            }));
        }).then(function (data) {
            setTotalInsiderThreats(data[0] + data[1] + data[2]);
            setThreatData([{
                "id": "Contained",
                "label": "Contained",
                "value": data[0],
                "color": "hsl(21, 70%, 50%)"
            },
            {
                "id": "Live",
                "label": "Live",
                "value": data[1],
                "color": "hsl(152, 70%, 50%)"
            },
            {
                "id": "False",
                "label": "False",
                "value": data[2],
                "color": "hsl(152, 70%, 50%)"
            }])
        }).catch(function (error) {
            // if there's an error, log it
            console.log(error);
        });
    }, []);

    return (
        <Link to="/app/insiderthreats" className={classes.link}>
            <Paper style={shadow === 0 ? {} : {backgroundColor: "rgba(255, 255, 255, 0.1)"}} varient="elevation" onMouseOut={() => setShadow(0)} onMouseOver={() => setShadow(24)} elevation={shadow} className={classes.card}>
                <Typography component="h1" variant="h5">
                    Total Insider Threats
            </Typography>
                <Paper variant="outlined" style={{ height: '275px' }}>
                    <ResponsivePie
                        data={threatData}
                        margin={{ top: 10, right: 10, bottom: 10, left: 0 }}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        colors={{ scheme: 'pink_yellowGreen' }}
                        borderColor={{ from: 'color', modifiers: [['darker', '0.2']] }}
                        enableRadialLabels={true}
                        radialLabelsSkipAngle={10}
                        radialLabelsTextXOffset={6}
                        radialLabelsTextColor="white"
                        radialLabelsLinkOffset={0}
                        radialLabelsLinkDiagonalLength={16}
                        radialLabelsLinkHorizontalLength={0}
                        radialLabelsLinkStrokeWidth={1}
                        radialLabelsLinkColor={{ from: 'color' }}
                        enableSlicesLabels={true}
                        slicesLabelsSkipAngle={10}
                        slicesLabelsTextColor="white"
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                        theme={theme}
                        defs={[
                            {
                                id: 'dots',
                                type: 'patternDots',
                                background: 'inherit',
                                color: 'rgba(255, 255, 255, 0.2)',
                                size: 5,
                                padding: 0,
                                stagger: true
                            },
                            {
                                id: 'lines',
                                type: 'patternLines',
                                background: 'inherit',
                                color: 'rgba(255, 255, 255, 0.3)',
                                lineWidth: 1,
                                padding: 0,
                                spacing: 5
                            }
                        ]}
                        fill={[
                            {
                                match: {
                                    id: 'Contained'
                                },
                                id: 'lines'
                            },
                            {
                                match: {
                                    id: 'Live'
                                },
                                id: 'dots'
                            },
                        ]}
                    />
                </Paper>
                <Paper>
                    <Typography component="h1" variant="h5" className={classes.overlay}>
                        Total: {totalInsiderThreats}
                    </Typography>
                </Paper>
            </Paper>
        </Link>

    );
}
