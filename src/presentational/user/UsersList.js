import React, {useEffect, useState} from "react";
import {
    Box, Button,
    Collapse, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, MenuItem, Paper, Slide,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography,
} from "@mui/material";
import {
    Close,
    Delete,
    DoneOutline,
    Edit,
    HighlightOff,
    KeyboardArrowDown,
    KeyboardArrowUp,
    PersonAdd
} from "@mui/icons-material";
import {Link as RouterLink} from "react-router-dom";
import RestClient from "../../rest/RestClient";

const client = new RestClient();

const Link = React.forwardRef(function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function getRole(role){
    if(role === false)
        return "Consumer";
    return "Administrator";
}

function Row(user) {
    const { row } = user;

    const [open, setOpen] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openRemoveDeviceDialog, setOpenRemoveDeviceDialog] = React.useState(false);
    const [openDialogSuccess, setOpenDialogSuccess] = React.useState(false);
    const [openDialogError, setOpenDialogError] = React.useState(false);

    const [updatedUser, setUpdatedUser] = React.useState(row);

    const [nextRemoved, setNextRemoved] = React.useState(null);

    const onChange = (property, value) => {
        setUpdatedUser({
            ...updatedUser,
            [property] : value
        })
    }

    const handleClickOpenRemoveDeviceDialog = () => {
        setOpenRemoveDeviceDialog(true);
    }

    const handleCloseRemoveDeviceDialog = () => {
        setOpenRemoveDeviceDialog(false);
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

    return (
        <React.Fragment>
            <TableRow sx={{'& > *' : {borderBottom: 'unset'} }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                    {row.id}
                </TableCell>
                <TableCell align="center">{row.username}</TableCell>
                <TableCell align="center">{getRole(row.userType)}</TableCell>
                <TableCell align="center">
                    <IconButton disabled={row.id.toString() === localStorage.getItem("id").toString()} color="primary" aria-label="edit user" component="label" onClick={handleClickOpenEditDialog}>
                        <Edit/>
                    </IconButton>
                </TableCell>
                <TableCell align="center">
                    <IconButton disabled={row.id.toString() === localStorage.getItem("id").toString()} color="primary" aria-label="delete user" component="label" onClick={handleClickOpenDeleteDialog}>
                        <Delete/>
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1}}>
                            <Paper
                                sx={{display: 'flex',
                                flexDirection: 'column'}}
                            >
                                <Typography variant="h6" gutterBottom component="div">
                                    Devices
                                </Typography>
                                <Button variant="contained" href={`/users/${row.id}/add_device`}>Add Device</Button>
                            </Paper>
                            <Table size="small" aria-label="devices">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Device ID</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Address</TableCell>
                                        <TableCell>Threshold</TableCell>
                                        <TableCell>Remove</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.devices.map((devicesRow) => (
                                        <TableRow key={devicesRow.id}>
                                            <TableCell component="th" scope="row">
                                                {devicesRow.id}
                                            </TableCell>
                                            <TableCell>{devicesRow.description}</TableCell>
                                            <TableCell>{devicesRow.address}</TableCell>
                                            <TableCell>{devicesRow.threshold}</TableCell>
                                            <TableCell>
                                                <IconButton color="primary" aria-label="delete-device" component="label" onClick={() => {
                                                    setNextRemoved(devicesRow);
                                                    handleClickOpenRemoveDeviceDialog()
                                                }}>
                                                    <HighlightOff/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

            <Dialog
                open={openRemoveDeviceDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseRemoveDeviceDialog}
                aria-describedby="alert-dialog-delete-user">
                <DialogTitle>{`Delete User with id ${row.id}?`}</DialogTitle>
                <DialogActions>
                    <Button variant="contained" color="success" startIcon={<DoneOutline/>} onClick={handleCloseRemoveDeviceDialog}>
                        No
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<Close/>} onClick={() => {
                        handleCloseRemoveDeviceDialog();
                        client.removeDeviceFromUser(row.id, nextRemoved.id, localStorage.getItem("token"))
                            .then(r => {
                                console.log(r);
                                if(r === false)
                                    handleClickOpenDialogError();
                                else handleClickOpenDialogSuccess();
                            })
                            .catch(error  => {
                                console.log(error);
                                handleClickOpenDialogError();
                            });
                    }} >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openEditDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseEditDialog}
                aria-describedby="alert-dialog-edit-device"
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle>{`Edit User ${row.id}`}</DialogTitle>
                <DialogContent>
                    <TextField
                        id={`dialogUsernameTF${row.id}`}
                        variant="standard"
                        label="Username"
                        defaultValue={`${row.username}`}
                        margin="dense"
                        fullWidth={true}
                        onChange={e => onChange("username", e.target.value)}
                    />
                    <TextField
                        id={`dialogPasswordTF${row.id}`}
                        variant="standard"
                        type="password"
                        label="Password"
                        defaultValue={`${row.password}`}
                        margin="dense"
                        fullWidth={true}
                        onChange={e => onChange("password", e.target.value)}
                    />
                    <TextField
                        id={`dialogUserTypeTF${row.id}`}
                        variant="standard"
                        label="User Type"
                        margin="dense"
                        defaultValue={row.userType}
                        select
                        fullWidth={true}
                        onChange={e => onChange("userType", e.target.value)}
                    >
                        <MenuItem key={"false"} value={"false"}>Consumer</MenuItem>
                        <MenuItem key={"true"} value={"true"}>Administrator</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" startIcon={<Close/>} onClick={() => {
                        setUpdatedUser(row);
                        document.getElementById(`dialogUsernameTF${row.id}`).value = row.username;
                        document.getElementById(`dialogPasswordTF${row.id}`).value = "";
                        document.getElementById(`dialogUserTypeTF${row.id}`).value = row.userType;
                        handleCloseEditDialog();
                    }}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="success" startIcon={<DoneOutline/>} onClick={() => {
                        handleCloseEditDialog()
                        client.updateUser(updatedUser, localStorage.getItem("token"))
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

            <Dialog
                open={openDeleteDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseDeleteDialog}
                aria-describedby="alert-dialog-delete-user">
                <DialogTitle>{`Delete User with id ${row.id}?`}</DialogTitle>
                <DialogActions>
                    <Button variant="contained" color="success" startIcon={<DoneOutline/>} onClick={handleCloseDeleteDialog}>
                        No
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<Close/>} onClick={() => {
                        handleCloseDeleteDialog();
                        client.removeUserId(row.id, localStorage.getItem("token"))
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
                <DialogTitle>{"Users list has been updated"}</DialogTitle>
                <DialogActions>
                    <Button href={`/users`}>Ok</Button>
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
                    <Button href={`/users`}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default function UsersList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchData(){
            return await client.loadAllUsers(localStorage.getItem("token"))
        }
        fetchData().then(u => {
            console.log(u);
            setUsers([...u]);
        })
    }, [])

    return (
        <TableContainer component={Paper} align="center" margin="auto" height="100vh">
            <Typography variant="h4" gutterBottom component="div">
                Users
            </Typography>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell><Button startIcon={<PersonAdd/>} variant="contained" component={Link} to={"/users/add"}>Add User</Button></TableCell>
                        <TableCell align="center">ID</TableCell>
                        <TableCell align="center">Username</TableCell>
                        <TableCell align="center">Role</TableCell>
                        <TableCell align="center">Edit</TableCell>
                        <TableCell align="center">Remove</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <Row key={user.id} row={user}/>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}