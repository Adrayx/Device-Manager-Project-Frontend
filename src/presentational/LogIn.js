import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RestClient from "../rest/RestClient";
import {Alert, Dialog, DialogActions, DialogTitle, Snackbar} from "@mui/material";

const client = new RestClient();

const theme = createTheme();

export default function LogIn() {
    const [error, setError] = React.useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('username'),
            password: data.get('password'),
        });
        if(data.get('username') !== "" && data.get('password') !== "")
            client.logIn(data.get('username'), data.get('password'))
                .then(r => {
                    console.log(r)
                    if(r !== null){
                        localStorage.setItem("id", r.id)
                        localStorage.setItem("token", r.token)
                        localStorage.setItem("role", r.role)
                        handleClickOpenDialogSuccess();
                    }
                    else {
                        handleOpenBadCredentials()
                    }
                })
                .catch(error => {
                    console.log(error);
                    handleOpenBadCredentials();
                })
        else{
            handleClickAlertRF()
        }
    };

    const [openDialogSuccess, setOpenDialogSuccess] = React.useState(false);

    const handleClickOpenDialogSuccess = () => {
        setOpenDialogSuccess(true);
    }

    const handleCloseDialogSuccess = () => {
        setOpenDialogSuccess(false);
    };

    const [openAlert, setOpenAlert] = React.useState(false);
    const [message, setMessage] = React.useState("")

    const handleClickAlertRF = () => {
        setError(true);
        setOpenAlert(true);
        setMessage("Required fields are not filled!")
    }

    const handleCloseAlert = (event, reason) => {
        if(reason === 'clickaway')
            return;
        setOpenAlert(false);
        setError(false);
    }

    const handleOpenBadCredentials = () => {
        setMessage("Bad Credentials!")
        setError(true);
        setOpenAlert(true);
    }

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                error={error}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                error={error}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            {/*<Grid container>*/}
                            {/*    <Grid item xs>*/}
                            {/*        <Link href="#" variant="body2">*/}
                            {/*            Forgot password?*/}
                            {/*        </Link>*/}
                            {/*    </Grid>*/}
                            {/*    <Grid item>*/}
                            {/*        <Link href="#" variant="body2">*/}
                            {/*            {"Don't have an account? Sign Up"}*/}
                            {/*        </Link>*/}
                            {/*    </Grid>*/}
                            {/*</Grid>*/}
                        </Box>
                    </Box>
                </Container>
                <Dialog
                    open={openDialogSuccess}
                    keepMounted
                    onClose={() => {
                        handleCloseDialogSuccess();
                        window.location.reload(false);
                    }}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Logged In"}</DialogTitle>
                    <DialogActions>
                        <Button href={`/`}>Ok</Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                    <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            </ThemeProvider>
        </React.Fragment>
    )
}