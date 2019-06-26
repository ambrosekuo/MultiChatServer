const express = require('express');
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const {ReactDomServer} = require('react-dom/server');
const path = require('path');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);

let connections = [];
let messageBoard = {
    "TeamA" : [{username: 'bob', text: 'hiii', boxName:"BoxA"}],
    "TeamB" : [],
    "All" : []
};

app.use(bodyParser.urlencoded({ extended: false }));

// Handle React routing, return all requests to React app
  app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'build',
    'index.html'));
  });

io.on("connection", function(socket) {
    connections.push(socket);
    console.log("socket connected" + connections.length);
    socket.emit("updateMessageBoard", messageBoard);
    socket.on("sendMessage", (data) => {
        console.log(messageBoard);
        messageBoard[data.boxName].push(data.message);
        socket.broadcast.emit("updateMessageBoard", messageBoard);
    });
  socket.on("disconnecting", function(data) {

    });
});

server.listen(port, function() {
    console.log(`Listening on ${server.address().port}`);
  });
  