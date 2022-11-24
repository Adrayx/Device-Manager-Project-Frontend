import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";
import RestClient from "../../rest/RestClient";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const client = new RestClient();

export default function UserDevicesList(){
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        async function fetchData(){
            return await client.loadUserId(localStorage.getItem("id"), localStorage.getItem("token"))
        }
        fetchData().then(d => {
            setDevices([...d.devices])
        })
    }, [])

    return (
        <React.Fragment>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">ID</StyledTableCell>
                            <StyledTableCell align="center">Description</StyledTableCell>
                            <StyledTableCell align="center">Address</StyledTableCell>
                            <StyledTableCell align="center">Threshold</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {devices.map((row) => (
                            <StyledTableRow key={row.name}>
                                <StyledTableCell component="th" scope="row" align="center">
                                    {row.id}
                                </StyledTableCell>
                                <StyledTableCell align="center">{row.description}</StyledTableCell>
                                <StyledTableCell align="center">{row.address}</StyledTableCell>
                                <StyledTableCell align="center">{row.threshold}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
}