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
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ErrorIcon from '@material-ui/icons/Error';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  }
}));

function createData(name, role, email, department, last_activity_date, phone, flagged) {
    return { name, role, email, department, last_activity_date, phone, flagged};
  }
  
const rows = [
    createData('Mark Abdullah', "Software Dev", "mark@company.com", "Operations", "10/27/2020 10:05:14", "123-456-7890", false),
    createData('Rob Moss', "Software Dev", "rob@company.com", "insiderManz", "10/28/2020 08:14:53", "123-456-7890", true),
    createData('Vinay Komaravolu', "Software Dev", "vinay@company.com", "Development", "11/1/2020 09:13:24", "123-456-7890", false),
    createData('Dipanker Bagga', "Financial Lead", "dipanker@company.com", "Finance", "10/30/2020 14:14:13", "123-456-7890", false),
    createData('Mina Gobrail', "Physician ", "mina@company.com", "Health", "10/13/2020 18:42:31", "123-456-7890", false),
    createData('Cora', "Data Analyst", "cora@company.com", "Security", "10/14/2020", "123-456-7890 11:12:13", false)
];

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
  
    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>{row.last_activity_date}</TableCell>
                <TableCell>
                {row.flagged &&  <ErrorIcon /> }
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            Put extra user info here
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}




function Users() {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc")
  const [orderBy, setOrderBy] = React.useState("date")
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
    <Paper className={classes.paper}>
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell />
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
  );
}

export default Users; 