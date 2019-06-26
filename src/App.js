import React from 'react';
import logo from './logo.svg';
import './App.css';
import ChatBox from './chatbox.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1> Chat Server </h1>
      </header>
      <ChatBox className="ChatBox" chatName="TeamA" ></ChatBox>
      <ChatBox className="ChatBox" chatName="TeamB"></ChatBox>
      <ChatBox className="ChatBox" chatName="All"></ChatBox>
    </div>
  );
}

export default App;
