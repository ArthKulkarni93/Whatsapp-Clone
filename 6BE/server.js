const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
const { PrismaClient } = require('@prisma/client');


const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const prisma = new PrismaClient();

getusername = () => {
    return "user" + Math.floor(Math.random() * 10);
} 

let users = new Map();
let rooms = new Map();
let cnt = 0;
wss.on('connection', (ws) => {
    console.log(`new client added, total clients: ${++cnt}`);
    let username = getusername();
    // prisma.msg.create({
    //     data: {
    //         id: username
    //     }
    // })
    ws.send(JSON.stringify({
        type: "welcome",
        username: username
    }))
    users.set(ws, username);
    

    ws.on('message', (message) => {
        message = JSON.parse(message);
        console.log(message);

        if(message.type === "message") {
            // message = message.toString('utf-8');
            // console.log(message);

            

            if(rooms.has(message.room)) {
                console.log(1);

                prisma.msg.create({
                    data: {
                        sender: users.get(ws),
                        content: message.msg,
                        room: message.room
                    }
                }) .then(() => {
                    console.log(`stored in db`)
                }) .catch (error => {
                    console.log(`error in storing msgs`, error);
                })
                rooms.get(message.room).forEach((client) => {
                    if(client.readyState === WebSocket.OPEN && client !== ws) {
                        client.send(JSON.stringify({
                            type: "message",
                            msg: message.msg,
                            sender: users.get(ws),
                            room: message.room
                        }))
                    }
                })
            }
        } 

        if(message.type === "joinroom") {
            let flag = 0;
            if(!rooms.has(message.room)) {
                console.log(0);
                rooms.set(message.room, new Set());
                rooms.get(message.room).add(ws);
            } else {
                console.log(1);
                if(rooms.get(message.room).has(ws)) {
                    flag = 1;
                } else {
                    rooms.get(message.room).add(ws);
                }
                
            }

            prisma.msg.findMany({
                where: {
                    room : message.room
                },
                orderBy: {
                    timestamp: "asc"
                }, 
                take: 50
            }) .then((messages) => {
                ws.send(JSON.stringify({
                    type: "history",
                    msg: messages
                }))
            }) .catch((e) => {
                console.log(`error in recieving chat history`, e);
            })
            if(!flag) {
                rooms.get(message.room).forEach((client) => {
                    if(WebSocket.OPEN === client.readyState && ws !== client) {
                        client.send(JSON.stringify({
                            type: "joinroom",
                            msg: `${users.get(ws)} joined the room`,
                            room: null
                        }))
                    }
                })
                ws.send(JSON.stringify({
                    type: "joinroom",
                    room: message.room,
                    msg: `${users.get(ws)} joined the room`
                }))
            }
            else {
                ws.send(JSON.stringify({
                    type: "joinroom",
                    room: message.room,
                    msg: ""
                }))
            }
        }

        if(message.type === "typing") {
            rooms.get(message.room).forEach((client) => {
                if(client.readyState === WebSocket.OPEN && client !== ws) {
                    client.send(JSON.stringify({
                        type: "typing",
                        typer: users.get(ws)
                    }))
                }
            })
        }
        
        if(message.type === "stopTyping") {
            rooms.get(message.room).forEach((client) => {
                if(client.readyState === WebSocket.OPEN && client !== ws) {
                    client.send(JSON.stringify({
                        type: "stopTyping",
                        typer: users.get(ws)
                    }))
                }
            })
        }

        if(message.type === "leaveroom") {
            if(rooms.has(message.room)) {
                rooms.get(message.room).delete(ws);
                ws.send(JSON.stringify({
                    type: "leaveroom", 
                    msg: `left the room ${message.room}`
                }))
                if (rooms.get(message.room).size === 0) {
                    rooms.delete(message.room);
                }
                rooms.get(message.room).forEach((client) => {
                    if(client.readyState === WebSocket.OPEN && ws != client) {
                        client.send(JSON.stringify({
                            type: "leaveroom",
                            msg: `${users.get(ws)} left the room`
                        }))
                    }
                })
            }
        }
    })

    ws.on('close', () => {
        console.log(`client disconnected, ${--cnt}`);
        users.delete(ws);
        rooms.forEach((client, room) => {
            client.delete(ws);
            if(client.size === 0) {
                rooms.delete(client);
            }
        })
    })
})

const PORT = 4001;
server.listen(PORT, console.log(`running on ${PORT}`));