import React from "react";
import "./chatbox.css";
import io from "socket.io-client";

function Message(props) {
  return (
    <div className="Message">
      <div className="Sender"> {props.username} </div>
      <div className="MessageText"> {props.text} </div>
    </div>
  );
}

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "Guest",
      boxName: props.chatName,
      typedMessage: "",
      messageBoard: []
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.socket = io("http://localhost:5000/");
    this.handleChatChange = this.handleChatChange.bind(this);
    this.socket.on("updateMessageBoard", serverMessageBoard => {
      this.setState({ messageBoard: serverMessageBoard[this.state.boxName]});
    });
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    console.log(this.state.messageBoard.length);
    let messages = this.state.messageBoard.map((message, i, a) => {
      console.log(message);
      return (
        <Message
          username={message.username}
          text={message.text}
          key={this.state.boxName + i}
        >
          {" "}
        </Message>
      );
    });
    return (
      <div className="ChatBox-Container">
        <h1 className="Title"> {this.state.boxName} Chat </h1>
        <div className="Message-Container" />
        {messages}

        <form
          className="MessageInput"
          onSubmit={e => this.sendMessage(e)}
          value={this.typedMessage}
          onChange={this.handleChatChange}
        >
          <h3>{this.state.username}</h3>
          <input
            className="Message-Sent"
            type="text"
          />
        </form>
      </div>
    );
  }

  handleChatChange = e => {
    this.setState({ typedMessage: e.target.value });
  };

  sendMessage(e) {
    e.preventDefault();
    const message = {
      username: this.state.username,
      text: this.state.typedMessage
    };
    this.setState(state => {
      const newMessageBoard = [...state.messageBoard, message];
      return { messageBoard: newMessageBoard };
    });
    this.socket.emit("sendMessage", {
      message: message,
      boxName: this.state.boxName
    });
    this.setState({ typedMessage: ""});
  }
}

export default ChatBox;
