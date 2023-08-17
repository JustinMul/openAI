// client/src/App.js

import React from "react";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);
  const [text, setText] = React.useState('')

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
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
        return true
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
        <input onChange={(e) => setText(e.target.value)} placeholder="Enter your question here"></input>
        <button onClick={sendData}>Search</button>
        {/* <p>{!data ? "Loading..." : data}</p> */}
      </header>
    </div>
  );
}

export default App;