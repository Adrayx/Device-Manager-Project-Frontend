import * as React from "react";
import {Link as RouterLink, useParams} from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    CircularProgress, Dialog, DialogActions, DialogTitle,
    Fab, MenuItem, Slide, Snackbar, Stack,
    TextField,
    Typography
} from "@mui/material";
import { green } from '@mui/material/colors';
import {Add, Check, KeyboardReturn, Save} from "@mui/icons-material";
import {useEffect} from "react";
import RestClient from "../../rest/RestClient";

const Link = React.forwardRef(function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const client = new RestClient();

export default function UserAddDevice() {
    const {index} = useParams()

    const [users, setUsers] = React.useState([])
    const [devices, setDevices] = React.useState([])
    const [available, setAvailable] = React.useState([])
    const [selectedDevice, setSelectedDevice] = React.useState({
        device:
            {id: -1,
            description: "",
            address: "",
            threshold: -1}
    });

    const onChange = (property, value) => {
        setSelectedDevice({
            ...selectedDevice,
            [property] : value
        })
    }

    const [success, setSuccess] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [openDialogSuccess, setOpenDialogSuccess] = React.useState(false);
    const [openDialogError, setOpenDialogError] = React.useState(false);

    const [openTF, setOpenTF] = React.useState(true);

    const handleClickOpen = () => {
        setOpenTF(false);
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpenAlert = () => {
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

    useEffect(() => {
        client.loadAllUsers(localStorage.getItem("token"))
            .then(r => setUsers([...r]))
        client.loadAllDevices(localStorage.getItem("token"))
            .then(r => setDevices([...r]))
    }, [])

    function handleClick(){
        setLoading(true)
        setSuccess(false);
        console.log(devices)

        let usedDevices = [];
        for(const u of users){
            usedDevices = usedDevices.concat(u.devices)
        }

        console.log(usedDevices)
        let freeDevices = []
        devices.forEach(device => {
            let found = false;
            for(const uDevice of usedDevices)
                if(device.id === uDevice.id) {
                    found = true;
                }
            if(found !== true) {
                freeDevices = [...freeDevices, device]
            }
        })

        console.log(freeDevices)
        setAvailable([...freeDevices])

        setLoading(false)
        setSuccess(true);
        handleClickOpen()
    }

    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };

    return (
        <React.Fragment>
            <Typography variant="h4">
                Add Device to User {index}
            </Typography>
            <Stack>
                <Button
                    variant="outlined"
                    color="secondary"
                    endIcon={<KeyboardReturn/>}
                    component={Link}
                    to={"/users"}
                >
                    Go Back
                </Button>
                <Box sx={{ m: 1, position: 'relative' }}>
                    <Fab
                        aria-label={"save"}
                        color={"primary"}
                        sx={buttonSx}
                        onClick={handleClick}
                    >
                        {success ? <Check/> : <Add/>}
                    </Fab>
                    {loading && (
                        <CircularProgress
                            size={68}
                            sx={{
                                color: green[500],
                                position: 'absolute',
                                top: -6,
                                left: -6,
                                zIndex: 1
                            }}/>
                    )}
                    <TextField
                        select
                        fullWidth
                        variant="filled"
                        id="availableSelectedDeviceTF"
                        label="Device"
                        placeHolder={"Device ID : Device Description"}
                        onChange={e => onChange("device", e.target.value)}
                        helperText="Please select the device"
                        disabled={openTF}
                        required
                    >
                        {available.map((option) => (
                            <MenuItem key={option.id} value={option}>
                                {option.id} : {option.description}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button onClick={() => {
                        if(selectedDevice.device.id === -1)
                            handleClickOpenAlert();
                        else {
                            client.addDeviceToUser(index, selectedDevice.device.id, localStorage.getItem("token"))
                                .then(r => {
                                    console.log(r)
                                    if(r === null)
                                        handleClickOpenDialogError()
                                    else
                                        handleClickOpenDialogSuccess()
                                })
                                .catch(error => {
                                    console.log(error)
                                    handleClickOpenDialogError()
                                })
                        }
                    }}>
                        <Save/>
                    </Button>
                </Box>
            </Stack>
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