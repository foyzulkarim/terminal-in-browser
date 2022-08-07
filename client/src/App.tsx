import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./App.css";
import Terminal from "terminal-in-react";
import { SocketEvents, ProcessFlags } from "./Models";

function App() {
  const endpoint = "http://192.168.0.14:4000";

  const [pid, setPid] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [appSocket, setAppSocket] = useState<any>();
  const [headerMessage, setHeaderMessage] = useState("Initializing...");

  useEffect(() => {
    if (!isConnected) {
      connectWithServer();
    }
  }, [isConnected]);

  const connectWithServer = () => {
    console.log("connecting with server");
    setHeaderMessage("Connecting with server...");
    const socket = io(endpoint, {
      transports: ["websocket"],
    });
    console.log(socket);
    socket.on("connect", () => {
      console.log("connected: ", socket.id); //eg. x8WIv7-mJelg7on_ALbx
      setHeaderMessage(`Connected with server. Id: ${socket.id}`);
      setAppSocket(socket);
      setIsConnected(true);
    });
  };

  const handleKeyDown = (event: {
    preventDefault: () => void;
    which: number;
    ctrlKey: any;
    metaKey: any;
  }) => {
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === "c") {
      console.log("CTRL+C Pressed");
      handleCommand(["cancel"], () => {});
    }
  };

  const handleCommand = (input: any, print: Function) => {
    console.log(appSocket._callbacks);
    const fn = `$${SocketEvents.MESSAGE}`;
    if (!appSocket._callbacks[fn]) {
      appSocket.on(SocketEvents.MESSAGE, (msg: any) => {
        console.log(msg.flag);
        setPid(msg.pid);

        if (msg.flag === ProcessFlags.ONGOING.toString()) {
          print(msg.data);
        } else {
          print(msg.flag);
        }
      });
    }

    if (input[0] === "cancel") {
      const body = { id: appSocket.id, pid: pid };
      axios.post(`${endpoint}/kill`, body);
    } else {
      const body = { id: appSocket.id, command: input.join(" ") };
      axios.post(`${endpoint}/execute`, body);
    }
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
      onKeyDown={handleKeyDown}
    >
      {!isConnected && <button onClick={connectWithServer}>Connect</button>}
      {isConnected && (
        <Terminal
          color="black"
          backgroundColor="white"
          barColor="white"
          style={{ fontWeight: "bold", fontSize: "1.5em" }}
          msg={headerMessage}
          commandPassThrough={handleCommand}
          startState="maximised"
        />
      )}
    </div>
  );
}

export default App;
