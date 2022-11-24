import React, {useEffect} from 'react';
import {Button, Dialog, DialogActions, DialogTitle, Stack, TextField, Typography} from "@mui/material";
import {DoneOutline} from "@mui/icons-material";
import RestClient from "../../rest/RestClient";

const client = new RestClient();

export default function UserDetails() {
    const [user, setUser] = React.useState({
        username: "",
        password: "",
        userType: false
    });

    useEffect(() => {
        client.loadUserId(localStorage.getItem("id"), localStorage.getItem("token"))
            .then(r => setUser(r));
    })

    const onChange = (property, value) => {
        setUser({
            ...user,
            [property] : value
        })
    }

    const [openDialogSuccess, setOpenDialogSuccess] = React.useState(false);
    const [openDialogError, setOpenDialogError] = React.useState(false);

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
            <Typography variant="h4">
                My Profile
            </Typography>
            {   user.username !== "" &&
                <Stack>
                    <TextField
                        id={`dialogUsernameTF${user.id}`}
                        variant="standard"
                        label="Username"
                        defaultValue={`${user.username}`}
                        margin="dense"
                        fullWidth={true}
                        onChange={e => {
                            onChange("username", e.target.value)
                        }}
                    />
                    <TextField
                        id={`dialogPasswordTF${user.id}`}
                        variant="standard"
                        type="password"
                        label="Password"
                        defaultValue={`${user.password}`}
                        margin="dense"
                        fullWidth={true}
                        onChange={e => onChange("password", e.target.value)}
                    />
                </Stack>
            }
            <Button variant="contained" color="success" startIcon={<DoneOutline/>} onClick={() => {
                console.log(user)
                client.updateUser(user, localStorage.getItem("token"))
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

            <Dialog
                open={openDialogSuccess}
                keepMounted
                onClose={() => {
                    handleCloseDialogSuccess();
                    window.location.reload(false);
                }}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Profile has been updated"}</DialogTitle>
                <DialogActions>
                    <Button href={`/my_profile`}>Ok</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openDialogError}
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
                    <Button href={`/my_profile`}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}