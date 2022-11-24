import { navData } from "../navData";
import React from "react";
import {ListItemText, ListItem, ListItemIcon, DialogTitle, DialogActions, Dialog} from "@mui/material";
import {Link as RouterLink} from 'react-router-dom';
import {Login, Logout} from "@mui/icons-material";
import RestClient from "../../../rest/RestClient";
import Button from "@mui/material/Button";

const Link = React.forwardRef(function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

const client = new RestClient();

function ListItemLink(props) {
    const { icon, primary, to } = props;

    return (
        <li>
            <ListItem component={Link} to={to}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    )
}

function ListItemLogOut() {
    const [openDialogSuccess, setOpenDialogSuccess] = React.useState(false);

    const handleClickOpenDialogSuccess = () => {
        setOpenDialogSuccess(true);
    }

    const handleCloseDialogSuccess = () => {
        setOpenDialogSuccess(false);
    };

    return (
        <li>
            <ListItem onClick={() => {
                client.logOut(localStorage.getItem("token")).then(r => {console.log(r)});
                localStorage.clear();
                handleClickOpenDialogSuccess();
            }
            }>
                <ListItemIcon><Logout/></ListItemIcon>
                <ListItemText primary={"Log Out"} />
            </ListItem>
            <Dialog
                open={openDialogSuccess}
                keepMounted
                onClose={() => {
                    handleCloseDialogSuccess();
                    window.location.reload(false);
                }}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Logged Out"}</DialogTitle>
                <DialogActions>
                    <Button href={`/`}>Ok</Button>
                </DialogActions>
            </Dialog>
        </li>
    )
}

export default function Sidenav() {
    return (
        <React.Fragment>
            {navData.map(item =>{
                if(item.role === localStorage.getItem("role") || item.role.length === 0 || (item.role === "logged" && localStorage.getItem("token") !== null))
                    return <ListItemLink to={`/${item.link}`} primary={item.text} icon={item.icon}/>
                return null;
            })}
            {localStorage.getItem("token") === null &&
                <ListItemLink to={'/log_in'} primary={"Log In"} icon={<Login/>}/>
            }
            {localStorage.getItem("token") !== null &&
                <ListItemLogOut/>
            }
        </React.Fragment>
    )
}