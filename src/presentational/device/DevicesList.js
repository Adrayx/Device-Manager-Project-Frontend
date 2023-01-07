import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";
import RestClient from "../../rest/RestClient";
import {
    BarChartTwoTone,
    Delete,
    Edit,
    Add,
    DoneOutline,
    Close,
    LastPage,
    FirstPage,
    KeyboardArrowRight, KeyboardArrowLeft
} from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    DialogActions, DialogContent,
    DialogTitle,
    IconButton,
    Slide, TableFooter,
    TablePagination, TextField,
    Typography, useTheme, Snackbar, Alert
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import PropTypes from "prop-types";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const Link = React.forwardRef(function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const client = new RestClient();

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

function Row(device) {
    const {row} = device;

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openDialogSuccess, setOpenDeleteDialogSuccess] = React.useState(false);
    const [openDialogError, setOpenDialogError] = React.useState(false);

    const [updatedDevice, setUpdatedDevice] = React.useState(row);

    const onChange = (property, value) => {
        setUpdatedDevice({
            ...updatedDevice,
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
        setOpenDeleteDialogSuccess(true);
    }

    const handleCloseDialogSuccess = () => {
        setOpenDeleteDialogSuccess(false);
    };

    const handleClickOpenDialogError = () => {
        setOpenDialogError(true);
    }

    const handleCloseDialogError = () => {
        setOpenDialogError(false);
    };

    return (
        <React.Fragment>
            <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row" align="center">
                    {row.id}
                </StyledTableCell>
                <StyledTableCell align="center">{row.description}</StyledTableCell>
                <StyledTableCell align="center">{row.address}</StyledTableCell>
                <StyledTableCell align="center">{row.threshold}</StyledTableCell>
                <StyledTableCell align="center"><IconButton color="success" component={Link} to={`/devices/${row.id}/measurements`}>
                    <BarChartTwoTone/>
                </IconButton></StyledTableCell>
                <StyledTableCell align="center">
                    <IconButton color="primary" aria-label="delete device" component="label" onClick={() => {
                        setUpdatedDevice(row);
                        handleClickOpenEditDialog()
                    }}>
                        <Edit/>
                    </IconButton>
                </StyledTableCell>
                <StyledTableCell align="center">
                    <IconButton color="primary" aria-label="delete device" component="label" onClick={handleClickOpenDeleteDialog}>
                        <Delete/>
                    </IconButton>
                </StyledTableCell>
            </StyledTableRow>

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
                <DialogTitle>{`Edit Device ${row.id}`}</DialogTitle>
                <DialogContent>
                    <TextField
                        id={`dialogDescriptionTF${row.id}`}
                        variant="standard"
                        label="Device Description"
                        defaultValue={`${row.description}`}
                        margin="dense"
                        fullWidth={true}
                        onChange={e => onChange("description", e.target.value)}
                    />
                    <TextField
                        id={`dialogAddressTF${row.id}`}
                        variant="standard"
                        label="Device Address"
                        defaultValue={`${row.address}`}
                        margin="dense"
                        fullWidth={true}
                        onChange={e => onChange("address", e.target.value)}
                    />
                    <TextField
                        id={`dialogThresholdTF${row.id}`}
                        variant="standard"
                        label="Device Threshold"
                        defaultValue={`${row.threshold}`}
                        margin="dense"
                        fullWidth={true}
                        onChange={e => onChange("threshold", e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" startIcon={<Close/>} onClick={() => {
                        setUpdatedDevice(row);
                        document.getElementById(`dialogDescriptionTF${row.id}`).value = row.description;
                        document.getElementById(`dialogAddressTF${row.id}`).value = row.address;
                        document.getElementById(`dialogThresholdTF${row.id}`).value = row.threshold;
                        handleCloseEditDialog()
                    }}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="success" startIcon={<DoneOutline/>} onClick={() => {
                        handleCloseEditDialog()
                        client.updateDevice(updatedDevice, localStorage.getItem("token"))
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
                <DialogTitle>{`Delete Device with id ${row.id}?`}</DialogTitle>
                <DialogActions>
                    <Button variant="contained" color="success" startIcon={<DoneOutline/>} onClick={handleCloseDeleteDialog}>
                        No
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<Close/>} onClick={() => {
                        client.removeDeviceId(row.id, localStorage.getItem("token"))
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
            {/*Success Dialog*/}
            <Dialog
                open={openDialogSuccess}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => {
                    handleCloseDialogSuccess();
                    window.location.reload(false);
                }}
                aria-describedby="alert-dialog-slide-description"
                color="success"
            >
                <DialogTitle>{"Devices list has been updated successfully"}</DialogTitle>
                <DialogActions>
                    <Button href={`/devices`}>Close</Button>
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
                    <Button href={`/devices`}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default function UserDevicesList(){

    const [devices, setDevices] = useState([]);

    useEffect(() => {
        async function fetchData(){
            return await client.loadAllDevices(localStorage.getItem("token"))
        }
        fetchData().then(d => {
            setDevices([...d])
        })
    })

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - devices.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function connect() {
        let socket = new SockJS('http://localhost:8080/websocket-app');
        let stompClient = Stomp.over(socket);
        stompClient.connect({}, function(frame) {
            console.log(frame);
            stompClient.subscribe('/all/notification', result => {
                console.log(result.body);
                alert(result.body);
                handleClickSnackbar(result.body);
            });
        });
    }

    connect();

    const handleClickSnackbar = (message) => () => {
        setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
    };

    const [snackPack, setSnackPack] = React.useState([]);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [messageInfoSnackbar, setMessageInfoSnackbar] = React.useState(undefined);

    React.useEffect(() => {
        if(snackPack.length && !messageInfoSnackbar) {
            setMessageInfoSnackbar({...snackPack[0]});
            setSnackPack((prev) => prev.slice(1));
            setOpenSnackbar(true);
        } else if(snackPack.length && messageInfoSnackbar && openSnackbar){
            setOpenSnackbar(false)
        }
    }, [snackPack, messageInfoSnackbar, openSnackbar]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleExited = () => {
        setMessageInfoSnackbar(undefined);
    };

    return (
        <React.Fragment>
            <Snackbar
                key={messageInfoSnackbar ? messageInfoSnackbar.key : undefined}
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                severity="warning"
                TransitionProps={{ onExited: handleExited }}
                message={messageInfoSnackbar ? messageInfoSnackbar.message : undefined}
                action={
                    <React.Fragment>
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            sx={{ p: 0.5 }}
                            onClick={handleCloseSnackbar}
                        >
                            <Close />
                        </IconButton>
                    </React.Fragment>
                }
            >
                <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
                    { messageInfoSnackbar ? messageInfoSnackbar.message : undefined }
                </Alert>
            </Snackbar>
            <Paper
                sx={{display: 'flex',
                    flexDirection: 'column'}}
            >
                <Typography align="center" variant="h3" gutterBottom component="div">
                    Devices
                </Typography>
                <Button startIcon={<Add/>} variant="contained" component={Link} to={'/devices/add_device'}>Add Device</Button>
            </Paper>
            <TableContainer component={Paper}>
                <Table sx={{ padding: '20px',minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">ID</StyledTableCell>
                            <StyledTableCell align="center">Description</StyledTableCell>
                            <StyledTableCell align="center">Address</StyledTableCell>
                            <StyledTableCell align="center">Threshold</StyledTableCell>
                            <StyledTableCell align="center">See Measurements</StyledTableCell>
                            <StyledTableCell align="center">Edit</StyledTableCell>
                            <StyledTableCell align="center">Delete</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? devices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : devices
                        ).map((device) => (
                            <Row key={device.id} row={device}/>
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
                                count={devices.length}
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
    );
}