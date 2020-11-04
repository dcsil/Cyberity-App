import React from 'react';
import { Icon, makeStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import {ArrowDropDown}  from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  }
}));

function createData(name, role, email, status, date, phone) {
    return { name, role, email, status, date, phone };
  }
  
  const rows = [
    createData('Mark Abdullah', "Software Dev", "mark@company.com", "Contained", "10/27/2020", "123-456-7890"),
    createData('Rob Moss', "Software Dev", "rob@company.com", "Threat Detected", "10/28/2020", "123-456-7890"),
    createData('Vinay Komaravolu', "Software Dev", "vinay@company.com", "Contained", "11/1/2020", "123-456-7890"),
    createData('Dipanker Bagga', "Financial Lead", "dipanker@company.com", "Contained", "10/30/2020", "123-456-7890"),
    createData('Mina Gobrail', "Physician ", "mina@company.com", "Threat Detected", "10/13/2020", "123-456-7890"),
    createData('Cora', "Data Analyst", "cora@company.com", "Contained", "10/14/2020", "123-456-7890")
  ];

function InsiderThreats() {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc")
  const [orderBy, setOrderBy] = React.useState("date")
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (event) => {
      setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
      setAnchorEl(null)
  }

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
    <Paper className={classes.paper}>
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
                        active={orderBy === "date"}
                        direction={orderBy === "date" ? order : "asc"}
                        onClick={sortHandler("date")}>
                        Date
                    </TableSortLabel>
                </TableCell>
                <TableCell>Phone Number</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.sort(getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
                <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.phone}</TableCell>
                </TableRow>
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
  );
}

export default InsiderThreats; 