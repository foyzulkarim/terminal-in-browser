import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import axios from "axios";
import io from "socket.io-client";
import "./App.css";
import Terminal from "terminal-in-react";
import { useRef } from "react";

function App() {
  const endpoint = "http://localhost:4000";

  const [text, setText] = useState("Hello world");
  const [pid, setPid] = useState(0);
  const [isOngoing, setIsOngoing] = useState(false);
  const [command, setCommand] = useState("");
  const printFn = useRef();
  const [s, setS] = useState();

  const connectWithServer = () => {
    console.log("hello");
    const socket = io(endpoint, {
      // path: "/",
      transports: ["websocket"],
    });
    console.log(socket);
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
      setS(socket);
    });

    socket.on("hello", (msg: any) => {
      console.log(msg);
      setText(msg.data);
      setPid(msg.pid);

      //let data = terminalLineData;
      // data.push({ type: LineType.Input, value: msg.data });
      //setTerminalLineData(data);
      console.log(printFn);

      if (msg.flag === "ONGOING") {
        setIsOngoing(true);
        printFn.current && printFn.current(msg.data);
      } else {
        setIsOngoing(false);
        printFn.current && printFn.current("DONE");
      };
    });
  };

  const onBlur = (v: any) => {
    setCommand(v.target.value);
  };

  const sendCommand = () => {
    axios.get(`http://localhost:4000/execute?command=${command}`);
  };

  const cancelCommand = () => {
    axios.get(`http://localhost:4000/kill?pid=${pid}`);
  };

  const [emulatorState, setEmulatorState] = useState("");
  const [inputStr, setInputStr] = useState("");

  const showMsg = (s: string) => "Hello World" + s;

  const handleCommand = (input: string, print: Function) => {
    console.log(input, input.join(" "));
    printFn.current = print;
    // if (!s._callbacks.$hello) {
    //   s.on("hello", (msg: any) => {
    //     console.log(msg);
    //     setText(msg.data);
    //     setPid(msg.pid);

    //     console.log(print);
    //     print(msg.data);

    //     if (msg.flag === "ONGOING") {
    //       setIsOngoing(true);
    //     } else setIsOngoing(false);
    //   });
    // }

    axios.get(`http://localhost:4000/execute?command=${input.join(" ")}`);
  };

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
      <button onClick={connectWithServer}>Connect</button>
      <Terminal
        color="green"
        backgroundColor="black"
        barColor="black"
        style={{ fontWeight: "bold", fontSize: "1em" }}
        commands={{
          "open-google": () => window.open("https://www.google.com/", "_blank"),
          showmsg: showMsg,
          popup: () => alert("Terminal in React"),
        }}
        description={{
          "open-google": "opens google.com",
          showmsg: "shows a message",
          alert: "alert",
          popup: "alert",
        }}
        msg="You can write anything here. Example - Hello! My name is Foo and I like Bar."
        commandPassThrough={handleCommand}
      />
    </div>
  );
}

export default App;
