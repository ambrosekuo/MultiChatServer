import React from 'react';
import './App.css';

import ChatServer from './ChatServer.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1> Chat Server </h1>
      </header>
      <ChatServer> </ChatServer>
    </div>
  );
}

export default App;
