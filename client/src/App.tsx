import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import axios from "axios";
import io, { Socket } from "socket.io-client";
import "./App.css";
import Terminal from "terminal-in-react";
import { useRef } from "react";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

function App() {
  const endpoint = "http://localhost:4000";

  const [text, setText] = useState("Hello world");
  const [pid, setPid] = useState(0);
  const [isOngoing, setIsOngoing] = useState(false);
  const [command, setCommand] = useState("");
  const printFn = useRef();
  const [isConnected, setIsConnected] = useState(false);

  const [appSocket, setAppSocket] = useState<any>();

  useEffect(() => {
    if (!isConnected) {
      connectWithServer();
    }
  }, [isConnected]);

  const connectWithServer = () => {
    console.log("hello");
    const socket = io(endpoint, {
      // path: "/",
      transports: ["websocket"],
    });
    console.log(socket);
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
      setAppSocket(socket);
      setIsConnected(true);
    });

    // socket.on("hello", (msg: any) => {
    //   console.log(msg);
    //   setText(msg.data);
    //   setPid(msg.pid);

    //   //let data = terminalLineData;
    //   // data.push({ type: LineType.Input, value: msg.data });
    //   //setTerminalLineData(data);
    //   console.log(printFn);

    //   if (msg.flag === "ONGOING") {
    //     setIsOngoing(true);
    //     printFn.current && printFn.current(msg.data);
    //   } else {
    //     setIsOngoing(false);
    //     printFn.current && printFn.current("DONE");
    //   }
    // });
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

  const showMsg = (s: string) => "Hello World" + s;

  const handleCommand = (input: any, print: Function) => {
    console.log(input, input.join(" "));
    // printFn.current = print;
    if (!appSocket._callbacks.$hello) {
      appSocket.on("hello", (msg: any) => {
        console.log(msg);
        setText(msg.data);
        setPid(msg.pid);

        if (msg.flag === "ONGOING") {
          setIsOngoing(true);
          print(msg.data);
        } else {
          print("Done");
          setIsOngoing(false);
        }
      });
    }

    const body = { id: appSocket.id, command: input.join(" ") };

    axios.post(`http://localhost:4000/execute`, body);
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
      {!isConnected && <button onClick={connectWithServer}>Connect</button>}
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
