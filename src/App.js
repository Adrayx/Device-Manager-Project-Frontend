import {
    Routes,
    Route, Navigate,
} from "react-router-dom";

import './App.css';
import Home from "./presentational/NavBar/Home";
import Sidenav from "./presentational/NavBar/Components/Sidenav";
import UsersList from "./presentational/user/UsersList";
import DevicesList from "./presentational/device/DevicesList";
import UserDevicesList from "./presentational/device/UserDevicesList";
import * as React from "react";
import {
    Box,
    Drawer as MuiDrawer,
    AppBar as MuiAppBar,
    Toolbar,
    Typography,
    IconButton, Container, List, Divider, CssBaseline
} from "@mui/material";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {ChevronLeft, Menu} from "@mui/icons-material";
import DeviceMeasurementList from "./presentational/measurement/DeviceMeasurementList";
import CreateDevice from "./presentational/device/CreateDevice";
import CreateUser from "./presentational/user/CreateUser";
import UserDetails from "./presentational/user/UserDetails";
import UserAddDevice from "./presentational/user/UserAddDevice";
import CreateMeasurement from "./presentational/measurement/CreateMeasurement";
import ConsumptionChart from "./presentational/measurement/ConsumptionChart";
import LogIn from "./presentational/LogIn";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const mdTheme = createTheme();

function App() {
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const PrivateRouteAdmin = ({ children }) => {
        const authed = ( localStorage.getItem("role") === "true" )
        if(authed){
            return children;
        }
        else
            return <Navigate to={"/"}/>
        //return authed ? children : <Redirect to="/login"/>;
    }
    const PrivateRouteClient = ({ children }) => {
        const authed = (localStorage.getItem("role").toString() === "false")
        if(authed){
            return children;
        }
        else
            return <Navigate to={"/"}/>
        // return authed ? children : <Redirect to="/login" />;
    }

    const PrivateRouteLogged = ({ children }) => {
        const authed = (localStorage.getItem("token") !== null)
        if(authed)
            return children
        else
            return <Navigate to={"/"}/>
    }

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline/>
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <Menu />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Dashboard
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeft />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <Sidenav/>
                    </List>
                </Drawer>
                <Box component="main"
                     sx={{
                         backgroundColor: (theme) =>
                             theme.palette.mode === 'light'
                                 ? theme.palette.grey[100]
                                 : theme.palette.grey[900],
                         flexGrow: 1,
                         height: '100vh',
                         overflow: 'auto',
                         padding: '10px',
                     }}
                >
                    <Toolbar />
                    <Container maxWidth="xl" sx={{ wt: 4, mb: 4}}>
                        <Routes>
                            <Route exact={true} path="/" element={<Home />}/>
                            <Route exact={true} path="/log_in" element={<LogIn/>}/>

                            <Route exact={true} path="/my_profile" element={<PrivateRouteLogged><UserDetails /></PrivateRouteLogged>} />
                            {/*<Route exact={true} path="/create_account" element={<Home />}/>*/}

                            <Route exact={true} path="/users" element={<PrivateRouteAdmin><UsersList /></PrivateRouteAdmin>} />
                            <Route exact={true} path="/users/add" element={<PrivateRouteAdmin><CreateUser /></PrivateRouteAdmin>} />
                            <Route exact={true} path="/users/:index/edit" element={<PrivateRouteAdmin><UserDetails/></PrivateRouteAdmin>}/>
                            <Route exact={true} path="/users/:index/add_device" element={<PrivateRouteAdmin><UserAddDevice /></PrivateRouteAdmin>}/>

                            <Route exact={true} path="/devices" element={<PrivateRouteAdmin><DevicesList /></PrivateRouteAdmin>}/>
                            <Route exact={true} path="/devices/add_device" element={<PrivateRouteAdmin><CreateDevice /></PrivateRouteAdmin>}/>
                            <Route exact={true} path="/devices/:index/measurements" element={<PrivateRouteAdmin><DeviceMeasurementList /></PrivateRouteAdmin>}/>
                            <Route exact={true} path="/devices/:index/add_measurement" element={<PrivateRouteAdmin><CreateMeasurement /></PrivateRouteAdmin>}/>

                            <Route exact={true} path="/my_devices" element={<PrivateRouteClient><UserDevicesList /></PrivateRouteClient>} />
                            <Route exact={true} path="/my_consumption" element={<PrivateRouteClient><ConsumptionChart /></PrivateRouteClient>} />
                        </Routes>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
export default App;