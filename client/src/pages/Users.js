import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Tooltip from '@material-ui/core/Tooltip';
import ErrorIcon from '@material-ui/icons/Error';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    box: {
        margin: 10,
        marginLeft: 50
    },
    small: {
        height: 35,
        width: 35
    },
    textfield: {
        paddingBottom: 20,
        paddingRight: 10
    },
    button: {
        marginRight: 5,
    },
    title: {
        paddingLeft: "10px",
        paddingBottom: "5px"
    }
}));

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    return (
        <React.Fragment>
            <TableRow>
                <TableCell padding="checkbox">
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.last_activity_date}</TableCell>
                <TableCell size="small">
                    {row.flagged &&
                        <Tooltip title={row.name + " has an active threat detected"}>
                            <IconButton>
                                <ErrorIcon />
                            </IconButton>
                        </Tooltip>}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box className={classes.box}>
                            <Typography>Position: {row.role}</Typography>
                            <Typography>Email: {row.email}</Typography>
                            <Typography>Phone: {row.phone}</Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}




function Users() {
    const classes = useStyles();
    const [rows, setRows] = React.useState([]);
    const [order, setOrder] = React.useState("asc")
    const [orderBy, setOrderBy] = React.useState("date")
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    // eslint-disable-next-line
    const [searchTerm, setSearchTerm] = React.useState("");

    React.useEffect(() => {
        fetch('/api/getEmployees', {
            method: 'GET',
            headers: new Headers({
                "content-type": "application/json",
            })
        })
            .then(response => response.json())
            .then(data => setRows(data))
            .catch(err => {
                console.log(err)
            })
    }, []);

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

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
        const searchRequest = '/api/getEmployees'+ (event.target.value !== "" ? "/" + event.target.value : "");
        fetch(searchRequest, {
            method: 'GET',
            headers: new Headers({
                "content-type": "application/json",
            })
        })
            .then(response => response.json())
            .then(data => setRows(data))
            .catch(err => {
                console.log(err)
            });
    }

    return (
        <React.Fragment>
            <Typography className={classes.title} variant="h3" display="inline">
                Users
            </Typography>
            <form>
                <TextField
                    className={classes.textfield}
                    name="searchBar"
                    variant="outlined"
                    label="Search Users"
                    size="small"
                    autoFocus
                    onChange={handleSearchTermChange}
                />
            </form>

            <Paper className={classes.paper}>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox" />
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === "name"}
                                        direction={orderBy === "name" ? order : "asc"}
                                        onClick={sortHandler("name")}>
                                        User Name
                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === "department"}
                                        direction={orderBy === "department" ? order : "asc"}
                                        onClick={sortHandler("department")}>
                                        Department
                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === "last_activity_date"}
                                        direction={orderBy === "last_activity_date" ? order : "asc"}
                                        onClick={sortHandler("last_activity_date")}>
                                        Last Activity Date
                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.sort(getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <Row key={row.name} row={row} />
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

export default Users; 