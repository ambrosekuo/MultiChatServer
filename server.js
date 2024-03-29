const express = require("express");
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const { ReactDomServer } = require("react-dom/server");
const path = require("path");
const app = express();
const cors = require('cors');
app.use(cors());
const server = require("http").Server(app);
const io = require("socket.io").listen(server);

// Default rooms to join, can add rooms just by adding to this. 
const DEFAULT_ROOMS = ["TeamA", "TeamB", "All"];

// Initial Message Board
let messageBoard = {
  TeamA: [
    {
      user: {
        socketID: "",
        id: -1,
        username: "Username", // Max-length = 10, default name is just Guest+id
        password: "", // Encrypt later, no password for now
        userSettings: {
          // Picks a random color from the color Array
          backgroundColor: "gold",
          permissions: []
        }
      },
      text: "Message",
      timeSent: "Time",
      boxName: "BoxA"
    }
  ],
  TeamB: [],
  All: []
};
// Turn into a database later, think about seperating into online/offline design, currently just treat online/userbase as the same
let userbase = [];
let onlineUsers = [];

// A user contains:
/*
let newUser = {
    // id to make each users unique, will be a number/based off of user array index for now
    socketID: socketID,
    id: userbase.length,
    username: "Guest" + userbase.length, // Max-length = 10, default name is just Guest+id
    password: "", // Encrypt later, no password for now
    userSettings: {
      // Picks a random color from the color Array
      backgroundColor:
        profileColors[Math.floor(Math.random() * profileColors.length)],
        permissions: DEFAULT_ROOMS,
    }
  };
  */

// Routing of the file. React file after build has static index file
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// On socket connection, start anonymous function
io.on("connect", function(socket) {
  console.log("socket connected: " + onlineUsers.length);
  console.log(onlineUsers);

  // Returns user if or null if none exists
  function findUserBySocketID(socketID) {
    return onlineUsers.filter(user => {
      return user.socketID === socketID;
    });
  }

  // Everytime we update message board we pass in all onlineUsers and messageBoard
  // ***** Think we have to delay this a little and wait for client to mount first
  socket.once("readyToReceiveUpdates", () => {
    let existingUser = findUserBySocketID(socket.id);
    // Existing User
    if (existingUser != null) {
      socket.emit("InitializeUser", initializeUser(socket.id));
    } else {
      socket.emit("InitializeUser", existingUser);
    }

    updateMessageBoard();
  });

  //When the client sends a message, it adds to the server message board 
  // and updates messageboard for all.
  socket.on("sendMessage", message => {
    messageBoard[message.boxName].push(message);
    updateMessageBoard();
  });

 //When the client changes their settings like their name, the server
 // their profile in the onlineUsers object
  socket.on("updateUserSettings", newProfile => {
    // Currently use id to track index of array, but if the project needs to be scaled, 
    //  the implementation may have to be changed
    onlineUsers[newProfile.id] = newProfile;
    updateMessageBoard();
  });

  // Handling client disconnection.
  socket.on("disconnecting", function(data) {
    console.log(
      "socket disconnecting: " +
        socket.id +
        " current connections: " +
        onlineUsers.length
    );
    // Need to implement less heavy logic on time complexity, since this has to find the user by ID
    onlineUsers = onlineUsers.filter(user => {
      console.log(
        "user.socketID: " + user.socketID + " socket.id: " + socket.id
      );
      return user.socketID !== socket.id;
    });

    updateMessageBoard();
  });

  function updateMessageBoard() {
    io.emit("updateMessageBoard", {
      messageBoard: messageBoard,
      onlineUsers: onlineUsers
    });
  }
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
    socketID: socketID,
    id: onlineUsers.length, // Change this to onlineUsers for now, change back to userbase when databse is implemented
    username: "Guest" + onlineUsers.length, // Max-length = 10, default name is just Guest+id
    password: "", // Encrypt later, no password for now
    userSettings: {
      // Picks a random color from the color Array
      backgroundColor:
        profileColors[Math.floor(Math.random() * profileColors.length)],
      permissions: DEFAULT_ROOMS
    }
  };
  userbase.push(newUser);
  onlineUsers.push(newUser);
  return newUser;
}

// Creates new Chat with name/users allowed
function createNewChat() {
  // Assuming userbase has all users
}
