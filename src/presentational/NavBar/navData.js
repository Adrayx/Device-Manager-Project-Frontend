
import {AccountBox, BarChartOutlined, DeviceHubRounded, Home, SupervisedUserCircleRounded} from "@mui/icons-material";

export const navData = [
    {
        id: 0,
        icon: <Home/>,
        text: "Home",
        link: "",
        role: ""
    },
    {
        id: 1,
        icon: <AccountBox/>,
        text: "My Profile",
        link: "my_profile",
        role: "logged"
    },
    {
        id: 2,
        icon: <SupervisedUserCircleRounded/>,
        text: "Users",
        link: "users",
        role: "true"
    },
    {
        id: 3,
        icon: <DeviceHubRounded/>,
        text: "Devices",
        link: "devices",
        role: "true"
    },
    {
        id: 4,
        icon: <DeviceHubRounded/>,
        text: "Devices",
        link: "my_devices",
        role: "false"
    },
    {
        id: 5,
        icon: <BarChartOutlined/>,
        text: "Consumption",
        link: "my_consumption",
        role: "false"
    }
]