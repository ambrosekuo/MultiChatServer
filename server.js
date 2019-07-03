const express = require("express");
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const { ReactDomServer } = require("react-dom/server");
const path = require("path");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);

let connections = [];
let messageBoard = {
  TeamA: [
    {
      user: {
        socketId: "",
        id: -1,
        username: "GodUser", // Max-length = 10, default name is just Guest+id
        password: "", // Encrypt later, no password for now
        userSettings: {
          // Picks a random color from the color Array
          backgroundColor: "gold"
        }
      },
      text: "hiii",
      timeSent: "",
      boxName: "BoxA"
    }
  ],
  TeamB: [],
  All: []
};
// Turn into a database later, think about seperating into online/offline design, currently just treat online/userbase as the same
let userbase = [];
let onlineUsers = [];

app.use(bodyParser.urlencoded({ extended: false }));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

io.on("connect", function(socket) {
  connections.push(socket);
  console.log("socket connected: " + connections.length);

  // Everytime we update message board we pass in all onlineUsers and messageBoard
  // ***** Think we have to delay this a little and wait for client to mount first
  socket.once("readyToReceiveUpdates", () => {
    socket.emit("InitializeUser", initializeUser());
    updateMessageBoard();
  });

  socket.on("sendMessage", message => {
    messageBoard[message.boxName].push(message);
    updateMessageBoard();
  });

  socket.on("updateUserSettings", newProfile => {
    // Currently use id to track index of array, definitely have to rethink implementation later
    onlineUsers[newProfile.id] = newProfile;
    updateMessageBoard();
  });

  socket.on("disconnecting", function(data) {
    connections.filter(connectionSocket => connectionSocket != socket.id);
    console.log(
      "socket disconnecting: " +
        socket.id +
        " current connections: " +
        onlineUsers.length
    );
    // Need to implement less heavy logic on time complexity, since this has to find the user by ID
    onlineUsers = onlineUsers.filter(user => {
        console.log("filtered");
        return (user.socketID != socket.id);
    });
    updateMessageBoard();
  });

  function updateMessageBoard() {
    io.emit("updateMessageBoard", {
        messageBoard: messageBoard,
        onlineUsers: onlineUsers
      });
};
});



server.listen(port, function() {
  console.log(`Listening on ${server.address().port}`);
});

// Probably just make own module here and import it in
const profileColors = [
  "lightseagreen",
  "lightskyblue",
  "lightcyan",
  "lightgoldenrodyellow"
];

// Creates new Users and push it onto the userbase array
// Returns the created user
function initializeUser(socketID) {
  let newUser = {
    // id to make each users unique, will be a number/based off of user array index for now
    socketId: socketID,
    id: userbase.length,
    username: "Guest" + userbase.length, // Max-length = 10, default name is just Guest+id
    password: "", // Encrypt later, no password for now
    userSettings: {
      // Picks a random color from the color Array
      backgroundColor:
        profileColors[Math.floor(Math.random() * profileColors.length)]
    }
  };
  userbase.push(newUser);
  onlineUsers.push(newUser);
  return newUser;
}
