const express = require('express');
const {Server: SocketIO} = require('socket.io');
require("dotenv").config();


const app = express();

const PORT = process.env.PORT || 3000
console.log(PORT)
const server = app.listen(PORT , console.log(`server is running on http://localhost:${PORT}`));

const io = new SocketIO(server);

const roomUsers = new Map();

io.on('connection' , socket => {
    console.log(`user connected ${socket.id}`);
    socket.emit('user joined' , socket.id);

    socket.on('room:join' , ({email , roomCode}) => {
        console.log("hehe",roomCode)
        if(!roomUsers.has(roomCode)){
            console.log("jij")
            roomUsers.set(roomCode, []);
        }
        const usersInRoom = roomUsers.get(roomCode);
         console.log("eee" , usersInRoom)
        const existingEmail = usersInRoom.find((i) => i.email === email);
        console.log("true")
        if(existingEmail){
            console.log("here")
            socket.emit('room:duplicate' , {message:'Email already in room'});
            return;
        }

        socket.join(roomCode);
        usersInRoom.push({email:email , socketId:socket.id});
        console.log(`${email} joined ${roomCode}`);
        
        if(usersInRoom.length === 2) {
            const initiator = usersInRoom[0];
            const receiver = usersInRoom[1];
            socket.emit('room:ready' , {roomCode});
            console.log("room created");
        }else{
            socket.emit('room:one' , {message:"waiting for another user to join the room..."})
        }
    })

})


