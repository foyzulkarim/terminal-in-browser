import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./App.css";
import Terminal from "terminal-in-react";
import { SocketEvents, ProcessFlags } from "./Models"

function App() {
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

  const handleCommand = (input: any, print: Function) => {
    console.log(appSocket._callbacks);
    const fn = `$${SocketEvents.MESSAGE}`;
    if (!appSocket._callbacks[fn]) {
      appSocket.on(SocketEvents.MESSAGE, (msg: any) => {
        console.log(msg);
        setPid(msg.pid);

        if (msg.flag === ProcessFlags.ONGOING.toString()) {
          print(msg.data);
        } else {
          print(msg.flag);
        }
      });
    }

    if (input[0] === 'cancel') {
      const body = { id: appSocket.id, pid: pid };
      axios.post(`http://localhost:4000/kill`, body);
    }
    else {
      const body = { id: appSocket.id, command: input.join(" ") };
      axios.post(`http://localhost:4000/execute`, body);
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
    >
      {!isConnected && <button onClick={connectWithServer}>Connect</button>}
      <Terminal
        color="green"
        backgroundColor="black"
        barColor="black"
        style={{ fontWeight: "bold", fontSize: "1em" }}
        commands={{
          "open-google": () => window.open("https://www.google.com/", "_blank"),
          popup: () => alert("Terminal in React"),
          // cancel: cancelCommand,
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
