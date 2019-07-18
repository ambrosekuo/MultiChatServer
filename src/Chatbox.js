import React from "react";
import "./Chatbox.css";

function Message(props) {
  console.log(props.user.backgroundColor);
  return (
    <div className="Message">
      <div className="Time-Sent"> {props.timeSent}: </div>
      <div
        className="Sender"
        style={{ background: props.user.userSettings.backgroundColor }}
      >
        {" "}
        {props.user.username}{" "}
      </div>
      <div className="MessageText"> {props.text} </div>
    </div>
  );
}

// Takes in count and an array of OnlineUsers
function OnlineUsers(props) {
  return (
    <div className="Users-Online">
      <h5> Users Online: {props.onlineUsers.length}</h5>
      <ul className="Users-List">
        {props.onlineUsers.map((user, i, users) => {
          return (
            <li className="User-Item" key={"user" + i}>
              {user.username}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      boxName: props.chatName,
      typedMessage: "",
      messageBoard: [],
      onlineUsers: props.onlineUsers
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.handleChatChange = this.handleChatChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ user: nextProps.user });
    this.setState({ messageBoard: nextProps.messageBoard });
    this.setState({ onlineUsers: nextProps.onlineUsers });
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    let messages = this.state.messageBoard.map((message, i, a) => {
      return (
        // Message user is not the same as the client user!
        <Message
          timeSent={message.timeSent}
          user={message.user}
          text={message.text}
          key={this.state.boxName + i}
        >
          {" "}
        </Message>
      );
    });
    return (
      <div className="ChatBox-Container">
        <h3 className="ChatBox-Title"> {this.state.boxName} Chat </h3>
        <OnlineUsers onlineUsers={this.state.onlineUsers}> </OnlineUsers>
        <div className="Messages">{messages}</div>
        <form
          className="MessageInput"
          onSubmit={e => this.sendMessage(e)}
          value={this.state.typedMessage}
          onChange={this.handleChatChange}
          style={{ background: this.state.user.userSettings.backgroundColor }}
        >
          <span
            className="Input-Username"
          >
            {" "}
            {this.state.user.username}{" "}
          </span>
          <input
            className="Input-Text"
            type="text"
            placeholder="Type a message"
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

    const today = new Date();
    let time =
      (today.getHours() % 12) +
      ":" +
      (today.getMinutes() < 10
        ? 0 + "" + today.getMinutes()
        : today.getMinutes()) +
      (today.getHours() < 12 ? "am" : "pm");

    const message = {
      user: this.state.user,
      text: this.state.typedMessage,
      timeSent: time,
      boxName: this.state.boxName
    };

    this.props.sendMessage(e, message);
  }
}

export default ChatBox;
