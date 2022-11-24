import React from 'react';
import {Typography} from "@mui/material";
import {Link as RouterLink, useParams} from "react-router-dom";

const Link = React.forwardRef(function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
});

export default function DeleteDevice() {
    const {index} = useParams()

    return (
        <React.Fragment>
            <Typography variant="h4">
                Delete Device {index}
            </Typography>
        </React.Fragment>
    )
}