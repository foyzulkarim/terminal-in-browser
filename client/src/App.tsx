import React, { useEffect } from "react";
import logo from "./logo.svg";
// ES6 import or TypeScript
import io from "socket.io-client";
import "./App.css";

function App() {
  const endpoint = "http://localhost:4001";
  useEffect(() => {
    console.log("hello");
    const socket = io(endpoint, {
      // path: "/",
      transports: ['websocket'],
    });
    console.log(socket);
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });

    socket.on("hello", (msg: string) => {
      console.log(msg);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>hello</h1>
      </header>
    </div>
  );
}

export default App;
