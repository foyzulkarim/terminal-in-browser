import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import axios from "axios";
import io from "socket.io-client";
import "./App.css";

function App() {
  const endpoint = "http://localhost:4000";

  const [text, setText] = useState("Hello world");
  const [pid, setPid] = useState(0);
  const [isOngoing, setIsOngoing] = useState(false);
  const [command, setCommand] = useState("");

  useEffect(() => {
    console.log("hello");
    const socket = io(endpoint, {
      // path: "/",
      transports: ["websocket"],
    });
    console.log(socket);
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("hello", (msg: any) => {
      console.log(msg);
      setText(msg.data);
      setPid(msg.pid);
      if (msg.flag === "ONGOING") {
        setIsOngoing(true);
      } else setIsOngoing(false);
    });
  }, []);

  const onBlur = (v: any) => {
    setCommand(v.target.value);
  };

  const sendCommand = () => {
    axios.get(`http://localhost:4000/execute?command=${command}`);
  };

  const cancelCommand = () => {
    axios.get(`http://localhost:4000/kill?pid=${pid}`);
  };

  return (
    <div className="App">
      <span>PID: {pid}</span>
      <input type="text" onBlur={onBlur} />
      <button onClick={sendCommand}>Submit</button>
      {isOngoing && <button onClick={cancelCommand}>Cancel</button>}
      <header className="App-header">{text}</header>
    </div>
  );
}

export default App;
