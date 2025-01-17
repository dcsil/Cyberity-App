import React from 'react';
import { makeStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Cookies from 'js-cookie'
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    label: {
        position: "relative",
        top: "8px",
        right: "10px",
    },
    setStatus: {
        position: "relative",
        right: "8px",
    },
    title: {
        paddingLeft: "10px"
    },
    filter: {
        backgroundColor: "#913973",
        display: "flex",
        justifyContent: "flex-end"
    }
}));

function Row(props) {
    const classes = useStyles();
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const history = useHistory();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(!open);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpen(!open);
    };

    const updateThreatStatus = (id, status) => (event) => {
        handleClose()
        row.status = status

        // fetch - update this threats status
        fetch('/api/userThreat/' + id.$oid, {
            method: 'PATCH',
            headers: new Headers({
                "content-type": "application/json",
                "X-CSRF-TOKEN": Cookies.get("csrf_access_token")
            }),
            body: JSON.stringify({
                "status": status,
            })
        }).then(response => {
            if (response.status === 401) {
                fetch('/api/logout', {
                    method: "POST",
                    headers: new Headers({
                        "content-type": "application/json"
                    })
                }).then(response => {
                    history.push("/signin")
                })
            }
        }).catch((error) => {
            console.log("NOT WORKING")
        })

    }

    return (
        <React.Fragment>
            <TableRow key={row._id+row.name+row.status+row.detectionDate}>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.detectionDate}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>
                    <IconButton size="small" onClick={handleClick}>
                    <Typography className={classes.setStatus} display="inline">
                        Set Status 
                    </Typography>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                    <Menu
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}>
                        <MenuItem disabled={row.status === 'contained'} onClick={updateThreatStatus(row._id, "contained")}>Set as Contained</MenuItem>
                        <MenuItem disabled={row.status === 'false'} onClick={updateThreatStatus(row._id, "false")}>Set as False Alert</MenuItem>
                        <MenuItem disabled={row.status === 'active'} onClick={updateThreatStatus(row._id, "active")}>Set as Active</MenuItem>
                    </Menu>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}

function InsiderThreats(props) {
    const classes = useStyles();
    const [rows, setRows] = React.useState([]);
    const [order, setOrder] = React.useState("asc")
    const [orderBy, setOrderBy] = React.useState("dateDetected")
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [selectedFilter, setSelectedFilter] = React.useState(props.location ? (props.location.state ? (props.location.state.status ? props.location.state.status : "All") : "All" ) : 'All');

    React.useEffect(() => {
        fetch('/api/get'+selectedFilter+'Threats', {
            method: 'GET',
            headers: new Headers({
                "content-type": "application/json",
            })
        })
            .then(response => response.json())
            .then(data => {
                data.forEach((item) => {
                    item["detectionDate"] = (new Date(item["detectionDate"]["$date"])).toString()
                })
                setRows(data);
            })
            .catch(err => {
                console.log(err)
            })
    }, [selectedFilter]);

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
        const filterRequest = '/api/get'+ event.target.value + 'Threats'
        fetch(filterRequest, {
            method: 'GET',
            headers: new Headers({
                "content-type": "application/json",
            })
        })
            .then(response => response.json())
            .then(data => {
                data.forEach((item) => {
                    item["detectionDate"] = (new Date(item["detectionDate"]["$date"])).toString()
                })
                setRows(data);
            })
            .catch(err => {
                console.log(err)
            });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const sortHandler = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <React.Fragment>
        <Typography className={classes.title} variant="h3" display="inline">
            Insider Threats
        </Typography>
        <Paper className={classes.paper}>
            <Paper className={classes.filter}>
            <Typography className={classes.label} display="inline">
                Filter Threats: 
            </Typography>
            <FormControl component="fieldset">
                <RadioGroup row aria-label="position" name="position" defaultValue="top">
                    <FormControlLabel
                        checked={selectedFilter === 'All'}
                        onChange={handleFilterChange}
                        value="All"
                        control={<Radio color="default" />}
                        label="All"
                    />
                    <FormControlLabel
                        checked={selectedFilter === 'Contained'}
                        onChange={handleFilterChange}
                        value="Contained"
                        control={<Radio color="default" />}
                        label="Contained"
                    />
                    <FormControlLabel
                        checked={selectedFilter === 'Active'}
                        onChange={handleFilterChange}
                        value="Active"
                        control={<Radio color="default" />}
                        label="Active"
                    />
                    <FormControlLabel 
                        checked={selectedFilter === 'False'}
                        onChange={handleFilterChange}
                        value="False" 
                        control={<Radio color="default" />}
                        label="False Postive" 
                    />
                </RadioGroup>
            </FormControl>
            </Paper>
            
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "name"}
                                    direction={orderBy === "name" ? order : "asc"}
                                    onClick={sortHandler("name")}>
                                    User Name
                    </TableSortLabel>
                            </TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "status"}
                                    direction={orderBy === "status" ? order : "asc"}
                                    onClick={sortHandler("status")}>
                                    Status
                    </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "detectionDate"}
                                    direction={orderBy === "detectionDate" ? order : "asc"}
                                    onClick={sortHandler("detectionDate")}>
                                    Detection Date
                    </TableSortLabel>
                            </TableCell>
                            <TableCell>Phone Number</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.sort(getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <Row key={row._id["$oid"]} row={row} />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 25, 100]}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
        </React.Fragment>
    );
}

export default InsiderThreats; 