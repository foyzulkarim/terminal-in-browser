import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { SocketEvents, ProcessFlags } from "./Models";
import logo from "./logo.svg";
import "./App.css";

import Terminal, {
  ColorMode,
  TerminalInput,
  TerminalOutput,
} from "react-terminal-ui";

const TerminalController = (props = {}) => {
  const [colorMode, setColorMode] = useState(ColorMode.Dark);
  const [lineData, setLineData] = useState([
    <TerminalOutput>
      Welcome to the React Terminal UI Demo!&#128075;
    </TerminalOutput>,
    <TerminalOutput></TerminalOutput>,
    <TerminalOutput>
      The following example commands are provided:
    </TerminalOutput>,
    <TerminalOutput>
      'view-source' will navigate to the React Terminal UI github source.
    </TerminalOutput>,
    <TerminalOutput>
      'view-react-docs' will navigate to the react docs.
    </TerminalOutput>,
    <TerminalOutput>'clear' will clear the terminal.</TerminalOutput>,
  ]);
  const endpoint = "http://localhost:4000";

  const [pid, setPid] = useState(0);
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
      transports: ["websocket"],
    });
    console.log(socket);
    socket.on("connect", () => {
      console.log(socket.id); //eg. x8WIv7-mJelg7on_ALbx
      setAppSocket(socket);
      setIsConnected(true);
    });
  };

  function onInput(input: string) {
    console.log(appSocket._callbacks);
    console.log("input", input);
    let ld = [...lineData];
    ld.push(<TerminalInput>{input}</TerminalInput>);
    if (input.toLocaleLowerCase().trim() === "view-source") {
      window.open("https://github.com/jonmbake/react-terminal-ui", "_blank");
    } else if (input.toLocaleLowerCase().trim() === "view-react-docs") {
      window.open("https://reactjs.org/docs/getting-started.html", "_blank");
    } else if (input.toLocaleLowerCase().trim() === "clear") {
      ld = [];
    } else if (input) {
      const fn = `$${SocketEvents.MESSAGE}`;
      if (!appSocket._callbacks[fn]) {
        appSocket.on(SocketEvents.MESSAGE, (msg: any) => {
          console.log(msg);
          setPid(msg.pid);

          if (msg.flag === ProcessFlags.ONGOING.toString()) {
            // print(msg.data);
            ld.push(<TerminalOutput>{msg.data}</TerminalOutput>);
          } else {
            // print(msg.flag);
            ld.push(<TerminalOutput>{msg.flag}</TerminalOutput>);
          }
        });
      }

      if (input === "cancel") {
        const body = { id: appSocket.id, pid: pid };
        axios.post(`http://localhost:4000/kill`, body);
      } else {
        const body = { id: appSocket.id, command: input };
        axios.post(`http://localhost:4000/execute`, body);
      }
    }

    // let ld = [...lineData];
    // ld.push(<TerminalInput>{input}</TerminalInput>);
    // if (input.toLocaleLowerCase().trim() === "view-source") {
    //   window.open("https://github.com/jonmbake/react-terminal-ui", "_blank");
    // } else if (input.toLocaleLowerCase().trim() === "view-react-docs") {
    //   window.open("https://reactjs.org/docs/getting-started.html", "_blank");
    // } else if (input.toLocaleLowerCase().trim() === "clear") {
    //   ld = [];
    // } else if (input) {
    //   ld.push(<TerminalOutput>Unrecognized command</TerminalOutput>);
    // }
    setLineData(ld);
  }

  return (
    <div className="container">
      <Terminal
        name="React Terminal UI"
        colorMode={colorMode}
        onInput={onInput}
      >
        {lineData}
      </Terminal>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <TerminalController />
    </div>
  );
};

export default App;
