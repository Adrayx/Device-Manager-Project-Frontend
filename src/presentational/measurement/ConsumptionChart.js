import React from "react";
import RestClient from "../../rest/RestClient";
import {Button, Paper, Stack, TextField, Typography} from "@mui/material";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';

const client = new RestClient();

export default function ConsumptionChart() {
    const [measurements, setMeasurements] = React.useState([])
    const [devices, setDevices] = React.useState([])
    const [date, setDate] = React.useState(dayjs());
    const data = new Map();
    const theme = useTheme();


    React.useEffect(() => {
        client.loadUserId(localStorage.getItem("id"), localStorage.getItem("token"))
            .then(r => setDevices([...r.devices]))
    }, [])

    React.useEffect(() => {
        let backMeasurements = []

        for(const device of devices){
            client.loadMeasurementsByDevice(device.id)
                .then(r => {
                    backMeasurements = backMeasurements.concat(r)
                    setMeasurements([...backMeasurements])
                })
        }
    }, [devices])

    function resetData(){
        data.set("00", 0);
        data.set("01", 0);
        data.set("02", 0);
        data.set("03", 0);
        data.set("04", 0);
        data.set("05", 0);
        data.set("06", 0);
        data.set("07", 0);
        data.set("08", 0);
        data.set("09", 0);
        data.set("10", 0);
        data.set("11", 0);
        data.set("12", 0);
        data.set("13", 0);
        data.set("14", 0);
        data.set("15", 0);
        data.set("16", 0);
        data.set("17", 0);
        data.set("18", 0);
        data.set("19", 0);
        data.set("20", 0);
        data.set("21", 0);
        data.set("22", 0);
        data.set("23", 0);
    }

    function addData(label, consumption){
        data.set(label, data.get(label) + consumption);
    }

    const [charMeasurements, setCharMeasurements] = React.useState([]);

    return (
        <React.Fragment>
            <Typography variant="h3">
                Consumption Chart
            </Typography>
            <Stack>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                        onChange={e => setDate(e)}
                        value={date}
                        inputFormat="YYYY-MM-DD"
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <Button
                    onClick={() => {
                        const localDate = new Date(date);
                        const queriedMeasurements = measurements.filter(m => {
                            const d = new Date(m.date)
                            return localDate.getFullYear() === d.getFullYear() && localDate.getMonth() === d.getMonth() && localDate.getDate() === d.getDate();
                        })
                        resetData()
                        queriedMeasurements.forEach(measurement => {
                            const label = measurement.time.toString().substring(0, 2)
                            addData(label, parseInt(measurement.consumption))
                        })

                        let m = []
                        for(const label of data.keys()){
                            m = m.concat([{
                                time: label + ":00",
                                value: data.get(label)
                            }])
                        }
                        setCharMeasurements(m)
                        console.log(charMeasurements)
                    }}
                >
                    Result
                </Button>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 480,
                    }}
                >
                    <ResponsiveContainer>
                        <LineChart
                            data={charMeasurements}
                            margin={{
                                top: 16,
                                right: 16,
                                bottom: 0,
                                left: 24,
                            }}
                        >
                            <XAxis
                                dataKey="time"
                                stroke={theme.palette.text.secondary}
                                style={theme.typography.body2}
                            />
                            <YAxis
                                stroke={theme.palette.text.secondary}
                                style={theme.typography.body2}
                            >
                                <Label
                                    angle={270}
                                    position="left"
                                    style={{
                                        textAnchor: 'middle',
                                        fill: theme.palette.text.primary,
                                        ...theme.typography.body1,
                                    }}
                                >
                                    Sales ($)
                                </Label>
                            </YAxis>
                            <Line
                                isAnimationActive={true}
                                type="monotone"
                                dataKey="value"
                                stroke={theme.palette.primary.main}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
            </Stack>
        </React.Fragment>
    )
}