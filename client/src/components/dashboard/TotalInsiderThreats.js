import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

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
    const [threatData, setThreatData] = useState({
        labels: ['Contained', 'Active', 'False'],
        datasets: [
            {
                label: 'Rainfall',
                backgroundColor: [
                    '#B21F00',
                    '#C9DE00',
                    '#2FDE00',
                ],
                hoverBackgroundColor: [
                    '#501800',
                    '#4B5000',
                    '#175000',

                ],
                data: [1, 1, 1]
            }
        ]
    });
    const [shadow, setShadow] = useState(0);

    useEffect(() => {
        Promise.all([
            fetch('/api/numContainedThreats', {
                method: 'GET',
                headers: new Headers({
                    "content-type": "application/json",
                })
            }),
            fetch('/api/numActiveThreats', {
                method: 'GET',
                headers: new Headers({
                    "content-type": "application/json",
                })
            }),
            fetch('/api/numFalseThreats', {
                method: 'GET',
                headers: new Headers({
                    "content-type": "application/json",
                })
            })
        ]).then(function (responses) {
            // Get a JSON object from each of the responses
            return Promise.all(responses.map(function (response) {
                return response.json();
            }));
        }).then(function (datacount) {
            setTotalInsiderThreats(datacount[0] + datacount[1] + datacount[2]);
            setThreatData({
                labels: ['Contained', 'Active', 'False'],
                datasets: [
                    {
                        label: 'Rainfall',
                        backgroundColor: [
                            'rgb(126, 201, 105)',
                            'rgb(179,0,119)',
                            'rgb(204, 104, 106)',
                        ],
                        borderColor: "#424242",
                        hoverBackgroundColor: [
                            'rgb(81, 130, 68)',
                            'rgb(107, 0, 71)',
                            'rgb(138, 69, 70)',

                        ],
                        textColor: "white",
                        data: [datacount[0], datacount[1], datacount[2]]
                    }
                ]
            })
        }).catch(function (error) {
            // if there's an error, log it
            console.log(error);
        });
    }, []);

    return (
        <Link to={{ pathname: "/app/insiderthreats", state: { status: "All" } }} className={classes.link}>
            <Paper style={shadow === 0 ? {} : { backgroundColor: "rgba(66,66,66, 0.35)" }} varient="elevation" onMouseOut={() => setShadow(0)} onMouseOver={() => setShadow(24)} elevation={shadow} className={classes.card}>
                <Typography component="h1" variant="h5">
                    Total Insider Threats
            </Typography>
                <Paper variant="outlined" style={{ height: '275px' }}>
                    <Doughnut
                        data={threatData}
                        height="205%"
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            legend: {
                                display: true,
                                position: 'bottom',
                                labels: {
                                    fontColor: 'white'
                                }
                            },
                        }}
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
