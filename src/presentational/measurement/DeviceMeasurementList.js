import React, {useEffect} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions, DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Slide,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow, TextField,
    Typography,
    useTheme
} from "@mui/material";
import {Link as RouterLink, useParams} from "react-router-dom";
import {
    FirstPage,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage,
    KeyboardReturn,
    AddCircle, Close, DoneOutline, Edit, Delete
} from "@mui/icons-material";
import PropTypes from "prop-types";
import RestClient from "../../rest/RestClient";

const client = new RestClient();

let globalIndex = -1;

const Link = React.forwardRef(function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

function Row(measurement){
    const { row } = measurement;

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openDialogSuccess, setOpenDialogSuccess] = React.useState(false);
    const [openDialogError, setOpenDialogError] = React.useState(false);

    const [updatedMeasurement, setUpdatedMeasurement] = React.useState(null);

    const onChange = (property, value) => {
        setUpdatedMeasurement({
            ...updatedMeasurement,
            [property] : value
        })
    }

    const handleClickOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleClickOpenEditDialog = () => {
        setOpenEditDialog(true);
    }

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const handleClickOpenDialogSuccess = () => {
        setOpenDialogSuccess(true);
    }

    const handleCloseDialogSuccess = () => {
        setOpenDialogSuccess(false);
    };

    const handleClickOpenDialogError = () => {
        setOpenDialogError(true);
    }

    const handleCloseDialogError = () => {
        setOpenDialogError(false);
    };

    return(
        <React.Fragment>
            <TableRow key={row.id}>
                <TableCell component="th" scope="row" align="center">
                    {row.id}
                </TableCell>
                <TableCell align="center">{row.date}</TableCell>
                <TableCell align="center">{row.time}</TableCell>
                <TableCell align="center">{row.consumption}</TableCell>
                <TableCell align="center">
                    <IconButton color="primary" aria-label="edit device" component="label" onClick={() => {
                        setUpdatedMeasurement(row)
                        handleClickOpenEditDialog()
                    }}>
                        <Edit/>
                    </IconButton>
                </TableCell>
                <TableCell align="center">
                    <IconButton color="primary" aria-label="edit device" component="label" onClick={handleClickOpenDeleteDialog}>
                        <Delete/>
                    </IconButton>
                </TableCell>
            </TableRow>
            {/*Edit Dialog*/}
            <Dialog
                open={openEditDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseEditDialog}
                aria-describedby="alert-dialog-edit-device"
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle>{`Edit Measurement ${row.id}`}</DialogTitle>
                <DialogContent>
                    <TextField
                        id={`datePicker${row.id}`}
                        label="Date"
                        variant="filled"
                        inputFormat="YYYY/MM/DD"
                        onChange={e => onChange("date", e.target.value)}
                        defaultValue={row.date}
                        margin="dense"
                    />
                    <TextField
                        id={`timePicker${row.id}`}
                        label="Time"
                        variant="filled"
                        inputFormat="HH:MM:SS"
                        onChange={e => onChange("time", e.target.value)}
                        defaultValue={row.time}
                        margin="dense"
                    />
                    <TextField
                        id={`consumptionTF${row.id}`}
                        variant="standard"
                        label="Consumption"
                        defaultValue={`${row.consumption}`}
                        margin="dense"
                        fullWidth={true}
                        onChange={e => onChange("consumption", e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" startIcon={<Close/>} onClick={() => {
                        handleCloseEditDialog();
                        setUpdatedMeasurement(row);
                        document.getElementById(`datePicker${row.id}`).value = row.date;
                        document.getElementById(`timePicker${row.id}`).value = row.time;
                        document.getElementById(`consumptionTF${row.id}`).value = row.consumption;
                    }}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="success" startIcon={<DoneOutline/>} onClick={() => {
                        handleCloseEditDialog()
                        client.updateMeasurement(updatedMeasurement, localStorage.getItem("token"))
                            .then(r => {
                                console.log(r)
                                handleClickOpenDialogSuccess()
                            })
                            .catch(error => {
                                console.log(error)
                                handleClickOpenDialogError()
                            })
                    }}>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/*Delete Dialog*/}
            <Dialog
                open={openDeleteDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseDeleteDialog}
                aria-describedby="alert-dialog-delete-device">
                <DialogTitle>{`Delete Measurement with id ${row.id}?`}</DialogTitle>
                <DialogActions>
                    <Button variant="contained" color="success" startIcon={<DoneOutline/>} onClick={handleCloseDeleteDialog}>
                        No
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<Close/>} onClick={() => {
                        client.removeMeasurementId(row.id, localStorage.getItem("token"))
                            .then(r => {
                                console.log(r);
                                handleCloseDeleteDialog();
                                if(r === false)
                                    handleClickOpenDialogError();
                                else handleClickOpenDialogSuccess();
                            })
                            .catch(error  => {
                                console.log(error);
                                handleCloseDeleteDialog();
                                handleClickOpenDialogError();
                            });
                    }} >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDialogSuccess}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => {
                    handleCloseDialogSuccess();
                    window.location.reload(false);
                }}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Measurements list has been updated"}</DialogTitle>
                <DialogActions>
                    <Button href={`/devices/${globalIndex}/measurements`}>Ok</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openDialogError}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => {
                    handleCloseDialogError();
                    window.location.reload(false);
                }}
                aria-describedby="alert-dialog-slide-description"
                color="error"
            >
                <DialogTitle color="error">{"An error has occurred, refresh the page!"}</DialogTitle>
                <DialogActions>
                    <Button href={`/devices/${globalIndex}/measurements`}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default function DeviceMeasurementList() {
    const {index} = useParams();
    globalIndex = index;

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = React.useState([]);

    useEffect(() => {
        async function fetchData(index){
            return await client.loadMeasurementsByDevice(index, localStorage.getItem("token"))
        }
        fetchData(index).then(u => {
            console.log(u);
            setRows([...u]);
        })
    }, [index])

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <React.Fragment>
            <Typography variant="h3">
                Device {index} Measurements
            </Typography>
            <Paper sx={{display: 'flex', flexDirection: 'row'}}>
                <Button
                    variant="contained"
                    startIcon={<AddCircle />}
                    component={Link}
                    to={`/devices/${index}/add_measurement`}
                >
                    Add Measurement
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    endIcon={<KeyboardReturn/>}
                    component={Link}
                    to={"/devices"}
                >
                    Go Back
                </Button>
            </Paper>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Time</TableCell>
                            <TableCell align="center">Consumption</TableCell>
                            <TableCell align="center">Edit</TableCell>
                            <TableCell align="center">Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows
                        ).map((row) => (
                            <Row key={row.id} row={row}/>
                        ))}

                        {emptyRows > 0 && (
                            <TableRow style={{ height:53 * emptyRows }}>
                                <TableCell colSpan={6}/>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1}]}
                                colSpan={3}
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
}