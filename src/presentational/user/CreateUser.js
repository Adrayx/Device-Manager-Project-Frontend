import React from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Divider,
    MenuItem,
    Paper, Slide, Snackbar,
    TextField,
    Typography
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {Add, KeyboardReturn} from "@mui/icons-material";
import RestClient from "../../rest/RestClient";

const Link = React.forwardRef(function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const client = new RestClient();

export default function CreateUser() {
    const [user, setUser] = React.useState({
        username: "",
        password: "",
        userType: false
    });

    const onChange = (property, value) => {
        setUser({
            ...user,
            [property] : value
        })
    }

    const [openDialogSuccess, setOpenDialogSuccess] = React.useState(false);
    const [openDialogError, setOpenDialogError] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    }

    const handleClose = (event, reason) => {
        if(reason === 'clickaway')
            return;
        setOpen(false);
    }


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
            <Paper sx={{ display: 'flex', flexDirection: 'column'}}>
                <Typography variant="h4">
                    Create User
                </Typography>
                <Divider/>
                <TextField
                    required
                    variant="filled"
                    label="Username"
                    margin="dense"
                    onChange={e => onChange("username", e.target.value)}
                />
                <TextField
                    required
                    variant="filled"
                    type="password"
                    label="Password"
                    margin="dense"
                    onChange={e => onChange("password", e.target.value)}
                />
                <TextField
                    variant="outlined"
                    label="User Type"
                    margin="dense"
                    defaultValue={false}
                    select
                    onChange={e => onChange("userType", e.target.value)}
                >
                    <MenuItem key={"false"} value={"false"}>Consumer</MenuItem>
                    <MenuItem key={"true"} value={"true"}>Administrator</MenuItem>
                </TextField>
                <Divider/>
                <Paper align={"center"} sx={{display: 'flex', flexDirection: 'row'}}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        endIcon={<KeyboardReturn/>}
                        component={Link}
                        to={"/users"}
                    >
                        Go Back
                    </Button>
                    <span>  </span>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<Add/>}
                        onClick={() => {
                            if(user.username.length === 0 || user.password.length === 0)
                                handleClick();
                            else {
                                console.log(user);
                                client.insertUser(user)
                                    .then(r => {
                                        if (r === null)
                                            handleClickOpenDialogError();
                                        else
                                            handleClickOpenDialogSuccess();
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        handleClickOpenDialogError();
                                    });
                            }
                        }}
                    >
                        Add User
                    </Button>
                </Paper>
            </Paper>
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
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    Required fields are not filled
                </Alert>
            </Snackbar>
        </React.Fragment>
    )
}