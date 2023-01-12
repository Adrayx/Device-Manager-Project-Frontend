import React, { useEffect, useState } from 'react'
import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs";
import "./Chat.css";
import RestClient from "../../rest/RestClient";
import {List, ListItem, Paper, TextField} from "@mui/material";
import Button from "@mui/material/Button";

let stompClient = null;
const rest = new RestClient();

const ChatRoom = () => {
    const [chats, setChats] = useState(new Map());
    const [tab, setTab] = useState("CHATS");
    const [userData, setUserData] = useState({
        userId: localStorage.getItem("id"),
        username: '',
        receiverName: '',
        connected: false,
        message: ''
    })

    const [open, setOpen] = useState(true);

    // useEffect(() => {
    //     getUsername();
    // })

    // useEffect(() => {
    //     if(localStorage.getItem("role") === 'true')
    //         setUserData({...userData, "username": "Admin"})
    //     else {
    //         rest.loadUserId(localStorage.getItem("id"), localStorage.getItem("token"))
    //             .then(r => {
    //                 setUserData({...userData, "username": r.username});
    //             })
    //             .catch(e => {
    //                 console.log(e);
    //             });
    //     }
    //     console.log(userData)
    // }, [userData])

    const getUsername = () => {
        if(localStorage.getItem("role") === 'true')
            setUserData({...userData, "username": "Admin"})
        else {
            rest.loadUserId(localStorage.getItem("id"), localStorage.getItem("token"))
                .then(r => {
                    setUserData({...userData, "username": r.username});
                })
                .catch(e => {
                    console.log(e);
                });
        }
        setOpen(false);
    }

    const handleMessage=(event)=>{
        const {value}=event.target;
        setUserData({...userData, message:value});
    }

    const connectUser=()=>{
        connect();
    }

    const sendValue=()=>{
        if (stompClient) {
            let chatMessage = {
                senderName: userData.username,
                receiverName:tab,
                message: userData.message
            };

            if(userData.username !== tab){
                chats.get(tab).push(chatMessage);
                setChats(new Map(chats));
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
        }
    }

    const onReceiveMessage = (payload)=>{
        console.log(payload);
        let payloadData = JSON.parse(payload.body);

        if(chats.get(payloadData.senderName)){
            chats.get(payloadData.senderName).push(payloadData);
            setChats(new Map(chats));
        }
        else{
            let list =[];
            list.push(payloadData);
            chats.set(payloadData.senderName,list);
            setChats(new Map(chats));
        }
    }

    const connect =()=>{
        console.log("In Connect");
        const URL = "http://localhost:8080/websocket-app";
        const websocket = new SockJS(URL);
        stompClient = Stomp.over(websocket);
        stompClient.connect({}, frame =>{
            console.log("Connected to " + frame);
            setUserData({...userData,"connected": true});
            if(localStorage.getItem("role") !== 'true'){
                chats.set('Admin',[]);
                setChats(new Map(chats));
            }
            if(!chats.get(userData.username)){
                chats.set(userData.username,[]);
                setChats(new Map(chats));
            }
            stompClient.subscribe('/user/'+userData.username+'/private', onReceiveMessage);
        });
        console.log(userData);
    }

    return (
        <Paper>
            {userData.connected?
                <div className="chat-box">
                    <div className="users-list">
                        <List>
                            {[...chats.keys()].map((name,index)=>(
                                <ListItem onClick={()=>{setTab(name)}} className={`user ${tab===name && "active"}`} key={index}>{name}</ListItem>
                            ))}
                        </List>
                    </div>
                    {tab!=="CHATS" && <div className="chat-content">
                        <List >
                            {[...chats.get(tab)].map((chat,index)=>(
                                <ListItem className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                                    {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                                    <div className="message-data">{chat.message}</div>
                                </ListItem>
                            ))}
                        </List>

                        <div className="send-message">
                            <TextField type="text" className="input"  name="message" placeholder="..." value={userData.message} onChange={handleMessage} />
                            <Button type="button" className="button" onClick={sendValue}>send</Button>
                        </div>
                    </div>}
                </div>
                :
                <div>
                    <Button onClick={getUsername}>
                        Get Username
                    </Button>
                    <Button onClick={connectUser} disabled={open}>
                        Connect
                    </Button>
                </div>}
        </Paper>
    )
}

export default ChatRoom;