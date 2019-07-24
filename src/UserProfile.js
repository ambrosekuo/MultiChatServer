import React from "react";
import "./UserProfile.css";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      editMode: false,
      typedUsername: "",
      errorMessage: ""
    };
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.changingUsername = this.changingUsername.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ user: nextProps.user });
    this.setState({ errorMessage: nextProps.errorMessage });
  }

  render() {
    let showUsername;
    if (this.state.editMode) {
      showUsername = (
        <form
          className="Changing-Username"
          onSubmit={e => this.changingUsername(e)}
          value={this.state.typedUsername}
          onChange={this.handleUsernameChange}
        >
          <input
            className="Changing-Username-Input"
            type="text"
            placeholder="Change Username"
          />
        </form>
      );
    } else {
      showUsername = (
        <h3>
          {" "}
          <span className="User-Label"> User: </span> {this.state.user.username}
        </h3>
      );
    }
    return (
      <div className="User-Profile">
        {showUsername}
        <button // toggle Edit-Button-false and true to change styling
          className={"Edit-Button-" + this.state.editMode}
          onClick={e => {
            this.toggleEditMode(e);
          }}
        >
          EDIT
        </button>
        <ul>
          <li>
            <strong>Chatrooms you are in:{" "} </strong>
            {this.state.user.userSettings.permissions.map(
              (chatBox, i, chatBoxes) => {
                return (
                  <span key={"Chatroom"+i}>
                    {" "}
                    {chatBox} {i < chatBoxes.length - 1 ? "," : ""}
                  </span>
                );
              }
            )}{" "}
          </li>
        </ul>
        <span className="Error-Message"> {this.state.errorMessage} </span>
      </div>
    );
  }

  toggleEditMode = e => {
    this.setState({ editMode: !this.state.editMode });
  };

  handleUsernameChange = e => {
    this.setState({ typedUsername: e.target.value });
  };

  changingUsername = e => {
    this.toggleEditMode(e);
    this.props.changeUsername(e, this.state.typedUsername);
    this.setState({ typedUsername: "" });
  };
}

export default UserProfile;
