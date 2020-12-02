import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    card: {
        padding: theme.spacing(2),
        textAlign: 'center',
        userSelect: 'none',
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'left',
        flexGrow: 1,
        marginTop: "5px",
        marginBottom: "5px"
    },
    link: {
        textDecoration: 'none'
    },
    table: {
        minWidth: 650,
    },
    tableCell: {
        backgroundColor: "#913973",
    }
}));

function createData(key, name, role, status, detectionDate) {
    return {key, name, role, status, detectionDate };
}


export default function RecentInsiderThreat() {
    const classes = useStyles();
    const [shadow, setShadow] = useState(0);
    const [recentThreatElements, setRecentThreatElements] = useState([])

    useEffect(() => {
        // TODO: SORT THEM BY 
        fetch('/api/getAllThreats/' + 5, {
            method: 'GET',
            headers: new Headers({
                "content-type": "application/json",
            })
        })
            .then(response => response.json())
            .then(data => {;
                const elements = data.map((userdata) => createData(userdata["_id"]["$oid"],userdata["name"], userdata["role"], userdata["status"], (new Date(userdata["detectionDate"]["$date"])).toString()))
                setRecentThreatElements(elements)
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    return (
        <Link to={{pathname:"/app/insiderthreats", state:{status: "All"}}} className={classes.link}>
            <Paper style={shadow === 0 ? {} : { backgroundColor: "rgba(66,66,66, 0.35)" }} varient="elevation" onMouseOut={() => setShadow(0)} onMouseOver={() => setShadow(24)} elevation={shadow} className={classes.card}>
                <Typography component="h1" variant="h5">
                    Recent Threats
                </Typography>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow className={classes.tableCell}>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Role</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Detection Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recentThreatElements.map((recentThreatElement) => (
                                <TableRow key={recentThreatElement.key}>
                                    <TableCell component="th" scope="row">
                                        {recentThreatElement.name}
                                    </TableCell>
                                    <TableCell align="right">{recentThreatElement.role}</TableCell>
                                    <TableCell align="right">{recentThreatElement.status}</TableCell>
                                    <TableCell align="right">{recentThreatElement.detectionDate}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Link>
    );
}