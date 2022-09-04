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
})

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Server running on port ${port}`));