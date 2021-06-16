import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import axios from "axios";
import io from "socket.io-client";
import "./App.css";
import Terminal, { ColorMode, LineType } from "react-terminal-ui";

const TerminalController = (props = {}) => {
  const [terminalLineData, setTerminalLineData] = useState([
    { type: LineType.Output, value: "Welcome to the React Terminal UI Demo!" },
    { type: LineType.Input, value: "Some previous input received" },
  ]);
  // Terminal has 100% width by default so it should usually be wrapped in a container div

  const handleInput = (input: string) => {
    terminalLineData.push({ type: LineType.Input, value: input });
    setTerminalLineData(terminalLineData);
  };

  useEffect(() => {
    const inputElement = document.querySelector(
      ".terminal-hidden"
    ) as HTMLInputElement;
    inputElement.placeholder = "";
  });

  return (
    <div className="container">
      <Terminal
        name="React Terminal Usage Example"
        colorMode={ColorMode.Dark}
        lineData={terminalLineData}
        onInput={handleInput}
      />
    </div>
  );
};

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

      let data = terminalLineData;
      data.push({ type: LineType.Input, value: msg.data });
      setTerminalLineData(data);

      if (msg.flag === "ONGOING") {
        setIsOngoing(true);
      } else setIsOngoing(false);
    });
  });

  const onBlur = (v: any) => {
    setCommand(v.target.value);
  };

  const sendCommand = () => {
    axios.get(`http://localhost:4000/execute?command=${command}`);
  };

  const cancelCommand = () => {
    axios.get(`http://localhost:4000/kill?pid=${pid}`);
  };

  const [terminalLineData, setTerminalLineData] = useState([
    { type: LineType.Output, value: "Welcome to the React Terminal UI Demo!" },
    { type: LineType.Input, value: "Some previous input received" },
  ]);
  // Terminal has 100% width by default so it should usually be wrapped in a container div

  const handleInput = (input: string) => {
    let data = terminalLineData;
    data.push({ type: LineType.Input, value: input });
    setTerminalLineData(data);
    axios.get(`http://localhost:4000/execute?command=${input}`);
  };

  useEffect(() => {
    const inputElement = document.querySelector(
      ".terminal-hidden"
    ) as HTMLInputElement;
    inputElement.placeholder = "";
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "black",
      }}
    >
      <div className="container">
        <Terminal
          name="React Terminal Usage Example"
          colorMode={ColorMode.Dark}
          lineData={terminalLineData}
          onInput={handleInput}
        />
      </div>
    </div>
  );
}

export default App;
