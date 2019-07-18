import React from "react";
import ChatBox from "./Chatbox.js";
import UserProfile from "./UserProfile.js";
import io from "socket.io-client";
import "./ChatServer.css";

//A message in the messageboard is {user: {}, text: "", timeSent: "", boxName: ""}

class ChatServer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {  
        socketID: -1,
        id: -1,
        username: "NameCLIENTSIDED",
        password: "", 
        userSettings: {
            backgroundColor: "black",
            permissions: []
        }
      },
      boxName: props.chatName,
      messageBoard: {
        TeamA: [] ,
        TeamB: [],
        All: []
      },
      onlineUsers: [],
      maxNameLength: 10,
      editMode: false,
      typedMessage: "",
    };
    

    //this.sendMessage = this.sendMessage.bind(this);
    this.socket = io("http://localhost:5000/");
    //this.handleChatChange = this.handleChatChange.bind(this);
    //updatedData is {messageBoard, onlineUsers}
    this.socket.on("InitializeUser", newUser => {
      this.setState({user:newUser});
    });
    this.socket.on("updateMessageBoard", updatedData => {
      console.log( updatedData.onlineUsers);
      this.setState({ messageBoard: updatedData.messageBoard, onlineUsers: updatedData.onlineUsers });
    });
    
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount () {
    // Server broadcasts the message before socket.on is initialize, so make server wait for initialiation first
    this.socket.emit("readyToReceiveUpdates");

    this.changeUsername = this.changeUsername.bind(this);
  }

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    let chatboxes = this.state.user.userSettings.permissions.map(boxName => {
      return (
      <ChatBox onlineUsers={this.state.onlineUsers} user={this.state.user} sendMessage = {this.sendMessage} chatName={boxName} messageBoard={this.state.messageBoard[boxName]} />);
    });
    return (
      <div className="Chat-Server">
        <UserProfile
          changeUsername={this.changeUsername}
          user={this.state.user}
          errorMessage={this.state.errorMessage}
          onlineUsers={this.state.onlineUsers}
        />
        {chatboxes};
      </div>
    );
  }

  changeUsername(e, newUsername) {
    e.preventDefault();
    if (newUsername.length > this.state.maxNameLength) {
      this.setState({
        errorMessage: "Maximum Username length is: " + this.state.maxNameLength
      });
    } else {

      // Changing object of an object? 
      let updatedUser = this.state.user;
      updatedUser.username = newUsername;
      this.setState({ user: updatedUser }, () => {
        this.updateUserSettings(this.state.user);
      });
      
    }
  }

  sendMessage(e, message) {
    e.preventDefault();

    /*
    this.setState(state => {
      let newMessageBoard = this.state.messageBoard;
      newMessageBoard[boxName] = [...state.messageBoard[boxName], message];
      return { messageBoard: newMessageBoard };
    }); */
    console.log(message);
    this.socket.emit("sendMessage", message);
  }
  
  updateUserSettings(newProfile) {
    // e.preventDefault();
    this.socket.emit("updateUserSettings", newProfile)
  };
}

export default ChatServer;
