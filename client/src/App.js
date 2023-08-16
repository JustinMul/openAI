// client/src/App.js

import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);
  const [text, setText] = React.useState('')

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  
  const sendQuery = (text)=>{
    
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>Ask something about apples financial history from the last 10 years</div>
        <input onChange={(e) => setText(e.target.value)} placeholder="Enter your question here"></input>
        <button onClick={sendQuery(text)}>Search</button>
        {/* <p>{!data ? "Loading..." : data}</p> */}
      </header>
    </div>
  );
}

export default App;