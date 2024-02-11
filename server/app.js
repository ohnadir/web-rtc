const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const socket = require('socket.io');


app.use(bodyParser.json({extended: true}));
const server = app.listen(8000, ()=>{
    console.log("Server Running on 8000 port");
});

const io = socket(server , { cors: true });


const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();
const userCollection = [];

io.on("connection", (socket) => {

    console.log(`Socket Connected`, socket.id);
    socket.on("user_info_to_singnaling_server", (data)=>{
        const {userName, meetingID} = data;
        const isUserExist = userCollection.find(p => p.userName === userName);
        const otherUsers = userCollection.filter(p => p.userName !== userName);
        if (!isUserExist) {
            userCollection.push({
                connectionID : socket.id,
                userName: userName,
                meetingID: meetingID
            });
        }
        
        otherUsers.forEach(v=>{
            socket.to(v.connectionID).emit('other-user-inform', {
                otherUsersID: userName,
                connectionID: socket.id
            });
        });
        socket.emit("newConnectionInformation", otherUsers);
    })

});
