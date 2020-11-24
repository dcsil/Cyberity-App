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
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Tooltip from '@material-ui/core/Tooltip';
import ErrorIcon from '@material-ui/icons/Error';
import { Link } from 'react-router-dom';

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
    }
}));

// function createData(name, role, email, department, last_activity_date, phone, flagged) {
//     return { name, role, email, department, last_activity_date, phone, flagged};
//   }

// const rows = [
//     createData('Mark Abdullah', "Software Dev", "mark@company.com", "Operations", "10/27/2020 10:05:14", "123-456-7890", false),
//     createData('Rob Moss', "Software Dev", "rob@company.com", "insiderManz", "10/28/2020 08:14:53", "123-456-7890", true),
//     createData('Vinay Komaravolu', "Software Dev", "vinay@company.com", "Development", "11/1/2020 09:13:24", "123-456-7890", false),
//     createData('Dipanker Bagga', "Financial Lead", "dipanker@company.com", "Finance", "10/30/2020 14:14:13", "123-456-7890", false),
//     createData('Mina Gobrail', "Physician ", "mina@company.com", "Health", "10/13/2020 18:42:31", "123-456-7890", false),
//     createData('Cora', "Data Analyst", "cora@company.com", "Security", "10/14/2020", "123-456-7890 11:12:13", false)
// ];

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
                            <IconButton component={Link} to={"/app/usereventtimeline/" + row.name} >
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
                            <Button variant="contained" color="primary" className={classes.button}>
                                Profile
                        </Button>
                            <Button variant="contained" color="primary" className={classes.button}>
                                Timeline
                        </Button>
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

    return (
        <React.Fragment>
            <form>
                <TextField
                    className={classes.textfield}
                    name="searchBar"
                    variant="outlined"
                    label="Search Users"
                    size="small"
                    autoFocus
                />
                <Button
                    variant="contained"
                    color="primary">
                    Search
        </Button>
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