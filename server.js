const http = require("http");
const express = require("express");
const socketio = require("socket.io")

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static("public"));

//Run when client connects
io.on("connection", socket => {
    console.log("New WS connection");

    //emits to the client making the connection
    socket.emit("message", "Welcome to ChatCord");

    //broadcast when a client connects
    //emits to everybody except the user
    socket.broadcast.emit("message", "A user has joined the chat");

    //Runs when client disconnects
    socket.on("disconnect", () => {
        //to all clients in the room
        io.emit("message", "A user has left the chat");
    });

    //handle the emit chat message from the client
    socket.on("chatMessage", (msg) => {
        console.log(msg);
        io.emit("message", msg);
    })
})

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server running on port ${port}`));