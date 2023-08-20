// client/src/App.js

import React, { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client"; // Import the socket.io client library

const socket = io(); // Connect to the server's socket.io instance

function App() {
  const [data, setData] = useState(null);
  const [text, setText] = useState('');

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));

    // Listen for updates from the server
    socket.on("openAIAnswer", (updatedData) => {
      setData(updatedData);
    });

    return () => {
      // Clean up the socket listener when the component unmounts
      socket.off("openAIAnswer");
    };
  }, []);

  const sendData = async () => {
    try {
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: text }),
      });

      if (response.ok) {
        console.log('Data sent successfully!');
        return true;
      } else {
        console.error('Failed to send data:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>Ask something about apples financial history from the last 10 years</div>
        <input onChange={(e) => setText(e.target.value)} placeholder="Enter your question here" />
        <button onClick={sendData}>Search</button>
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default App;
