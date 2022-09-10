const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static("public"));

const botName = "ChatCord Bot"
//Run when client connects
io.on("connection", socket => {

    //handle join room 
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //emits to the client making the connection
        socket.emit("message", formatMessage(botName, "Welcome to ChatCord"));

        //broadcast when a client connects
        //emits to everybody except the user
        socket.broadcast
        .to(user.room)
        .emit("message", formatMessage(botName, `${user.username} has joined the chat`));
    });

    //handle the emit chat message from the client
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    //Runs when client disconnects
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`));
        }

        //to all clients in the room
    });
})

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server running on port ${port}`));