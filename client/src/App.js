// client/src/App.js

import React, { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client"; // Import the socket.io client library
import ScrollableTextBox from "./components/ScrollableTextBox";

const socket = io("http://localhost:3002"); // Replace with the actual URL of your socket.io server



function App() {
  const [data, setData] = useState(null);
  const [text, setText] = useState('');
  const[loading, setLoading] = useState(false)
  const [messageList, setMessageList] = useState([]);
 

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

  useEffect(() => {
    if (data !== null) {
      // Update the message log whenever data changes
      setMessageList(prevMessageList => [...prevMessageList, data]);
      setData(null); // Clear data after adding to the message log
    }
  }, [data]);

  const sendData = async () => {
    if (text.trim() === '') {
      return; // Skip sending and updating if the text is empty
    }
  
    setMessageList(prevMessageList => [...prevMessageList, text]);
    setText(''); // Clear the input after sending
    setLoading(true); // Set loading state to true
  
    setData(null);
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
      } else {
        console.error('Failed to send data:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  
    setLoading(false); // Set loading state back to false after the request is completed
  };
  

  return (
    <div className="App">
      <header className="App-header">
        <div className="contentContainer">
          <div>
            <ScrollableTextBox
              text={!data ? (loading ? 'Loading...' : '') : data}
              messageList={messageList}
            />
          </div>
  
          <div className="inputContainer">
            <input
              onChange={(e) => setText(e.target.value)}
              placeholder="Send a message"
              className="searchBar"
              value={text}
            />
            <button disabled={loading} onClick={sendData}>
              {loading ? 'Sending...' : 'Search'}
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
