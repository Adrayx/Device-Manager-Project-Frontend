import axios from "axios";

const BASE_URL = "http://localhost:8080"

class RestClient {
    loadAllUsers = (token) => {
        return fetch( `${BASE_URL}/users`, {
            method : "GET",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            }
        }).then(response => {
            return response.json()
        })
    }

    loadAllDevices = (token) => {
        return fetch( `${BASE_URL}/devices`, {
            method : "GET",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            }
        }).then(response => {
            return response.json()
        })
    }

    loadAllMeasurements = () => {
        return fetch( `${BASE_URL}/measurements`, {
            method : "GET",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
            }
        }).then(response => {
            return response.json()
        })
    }

    loadUserId = (id, token) => {
        return fetch( `${BASE_URL}/users/${id}`, {
            method : "GET",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            }
        }).then(response => {
            return response.json()
        })
    }

    loadDeviceId = (id, token) => {
        return fetch( `${BASE_URL}/devices/${id}`, {
            method : "GET",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            }
        }).then(response => {
            return response.json()
        })
    }

    loadMeasurementId = (id, token) => {
        return fetch( `${BASE_URL}/measurements/${id}`, {
            method : "GET",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            }
        }).then(response => {
            return response.json()
        })
    }

    loadMeasurementsByDevice = (id) => {
        return fetch( `${BASE_URL}/measurements/by_device/${id}`, {
            method : "GET",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
            }
        }).then(response => {
            return response.json()
        })
    }

    insertUser = (user) => {
        return fetch( `${BASE_URL}/users`, {
            method : "POST",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(user)
        }).then(response => {
            return response.json()
        })
    }

    insertDevice = (device, token) => {
        return fetch( `${BASE_URL}/devices`, {
            method : "POST",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            },
            body : JSON.stringify(device)
        }).then(response => {
            return response.json()
        })
    }

    insertMeasurement = (measurement, token) => {
        return fetch( `${BASE_URL}/measurements`, {
            method : "POST",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            },
            body : JSON.stringify(measurement)
        }).then(response => {
            return response.json()
        })
    }

    updateUser = (user, token) => {
        return fetch( `${BASE_URL}/users`, {
            method : "PUT",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            },
            body : JSON.stringify(user)
        }).then(response => {
            return response.json()
        })
    }

    updateDevice = (device, token) => {
        return fetch( `${BASE_URL}/devices`, {
            method : "PUT",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            },
            body : JSON.stringify(device)
        }).then(response => {
            return response.json()
        })
    }

    updateMeasurement = (measurement, token) => {
        return fetch( `${BASE_URL}/measurements`, {
            method : "PUT",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            },
            body : JSON.stringify(measurement)
        }).then(response => {
            return response.json()
        })
    }

    removeUserId = (id, token) => {
        return fetch( `${BASE_URL}/users/${id}`, {
            method : "DELETE",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            }
        }).then(response => {
            return response.json()
        })
    }

    deleteUserId = (id, token) => {
        return axios.delete(`${BASE_URL}/users/${id}`, {
            headers: {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            }
        })
    }

    removeDeviceId = (id, token) => {
        return fetch( `${BASE_URL}/devices/${id}`, {
            method : "DELETE",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            }
        }).then(response => {
            return response.json()
        })
    }

    removeMeasurementId = (id, token) => {
        return fetch( `${BASE_URL}/measurements/${id}`, {
            method : "DELETE",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            }
        }).then(response => {
            return response.json()
        })
    }

    addDeviceToUser = (id, deviceId, token) => {
        return fetch( `${BASE_URL}/users/${id}/add/${deviceId}`, {
            method : "PUT",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            },
        }).then(response => {
            return response.json()
        })
    }

    removeDeviceFromUser = (id, deviceId, token) => {
        return fetch( `${BASE_URL}/users/${id}/remove/${deviceId}`, {
            method : "PUT",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            },
        }).then(response => {
            return response.json()
        })
    }

    addMeasurement = (id, consumption, token) => {
        return fetch( `${BASE_URL}/devices/${id}/${consumption}`, {
            method : "POST",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            }
        }).then(response => {
            return response.json()
        })
    }

    logIn = (username, password) => {
        return fetch( `${BASE_URL}/log_in`, {
            method : "POST",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "username" : username,
                "password" : password
            }
        }).then(response => {
            return response.json()
        })
    }

    logOut = (token) => {
        return fetch( `${BASE_URL}/log_out`, {
            method : "POST",
            headers : {
                "Application-Control-Allow-Origin" : "*",
                "Content-Type" : "application/json",
                "token" : token
            }
        }).then(response => {
            return response.json()
        })
    }
}

export default RestClient