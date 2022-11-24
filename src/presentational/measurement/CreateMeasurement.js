import * as React from "react";
import {Link as RouterLink, useParams} from "react-router-dom";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Divider,
    Paper, Slide, Snackbar,
    TextField,
    Typography
} from "@mui/material";
import {Add, KeyboardReturn} from "@mui/icons-material";
import RestClient from "../../rest/RestClient";

const client = new RestClient();

const Link = React.forwardRef(function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function CreateMeasurement() {
    const {index} = useParams()

    const [measurement, setMeasurement] = React.useState({
        date : "",
        time : "",
        consumption: -1,
        device: null
    })

    const onChange = (property, value) => {
        setMeasurement({
            ...measurement,
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
                    label="Date"
                    variant="filled"
                    inputFormat="YYYY-MM-DD"
                    onChange={e => onChange("date", e.target.value)}
                    placeholder="YYYY-MM-DD"
                    margin="dense"
                />
                <TextField
                    label="Time"
                    variant="filled"
                    inputFormat="HH:MM:SS"
                    placeholder="HH:MM:SS"
                    onChange={e => onChange("time", e.target.value)}
                    margin="dense"
                />
                <TextField
                    variant="standard"
                    label="Consumption"
                    margin="dense"
                    type="float"
                    fullWidth={true}
                    onChange={e => onChange("consumption", e.target.value)}
                />
                <Divider/>
                <Paper align={"center"} sx={{display: 'flex', flexDirection: 'row'}}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        endIcon={<KeyboardReturn/>}
                        component={Link}
                        to={`/devices/${index}/measurements`}
                    >
                        Go Back
                    </Button>
                    <span>  </span>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<Add/>}
                        onClick={() => {
                            if(measurement.date.length === 0 || measurement.time.length === 0 || measurement.consumption < 0)
                                handleClick();
                            else {
                                client.loadDeviceId(index, localStorage.getItem("token"))
                                    .then(r => {
                                        console.log(r)
                                        measurement.date = measurement.date.replaceAll("/", "-")
                                        measurement.device = r

                                        console.log(measurement)
                                        client.insertMeasurement(measurement, localStorage.getItem("token"))
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
                                    })
                            }
                        }}
                    >
                        Add Measurement
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
                <DialogTitle>{"Measurements list has been updated"}</DialogTitle>
                <DialogActions>
                    <Button href={`/devices/${index}/measurements`}>Ok</Button>
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
                    <Button href={`/devices/${index}/measurements`}>Close</Button>
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