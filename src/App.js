import React from 'react';
import logo from './logo.svg';
import './App.css';
import ChatBox from './Chatbox.js';
import UserProfile from './UserProfile.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1> Chat Server </h1>
      </header>
      <UserProfile> </UserProfile>
      <ChatBox username="Guest" chatName="TeamA" ></ChatBox>
      <ChatBox username="Guest" chatName="TeamB"></ChatBox>
      <ChatBox username="Guest" chatName="All"></ChatBox>
    </div>
  );
}

export default App;
