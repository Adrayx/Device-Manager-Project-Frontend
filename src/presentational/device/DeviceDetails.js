import React from 'react';
import {Button, Typography} from "@mui/material";
import {Link as RouterLink, useParams} from "react-router-dom";
import {KeyboardReturn} from "@mui/icons-material";

const Link = React.forwardRef(function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

export default function DeviceDetails() {
    const {index} = useParams()

    return (
        <React.Fragment>
            <Typography variant="h4">
                Update Device {index}
            </Typography>
            <Button
                variant="outlined"
                color="secondary"
                endIcon={<KeyboardReturn/>}
                component={Link}
                to={"/devices"}
            >
                Go Back
            </Button>
        </React.Fragment>
    )
}