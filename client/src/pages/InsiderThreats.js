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

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  }
}));


function InsiderThreats() {
  const classes = useStyles();
  const [rows, setRows] = React.useState([]);
  const [order, setOrder] = React.useState("asc")
  const [orderBy, setOrderBy] = React.useState("dateDetected")
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    fetch('/api/getAllThreats', {
        method: 'GET'
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
                <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.detectionDate}</TableCell>
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