import React from 'react';
import './App.css';

import ChatServer from './ChatServer.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1> TypeTalk</h1>
        <h5>A free chat messaging site </h5> 
      </header>
      <ChatServer> </ChatServer>
    </div>
  );
}

export default App;
