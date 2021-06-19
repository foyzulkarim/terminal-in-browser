import express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");

import EventEmitter from "./MyEmitter";
const { EventEmitterInstance: myEmitter } = EventEmitter;

const find = require("find-process");
import { Socket } from "socket.io";
import { runWorkerThread } from "./executor";
import { MyEmitterEvents, SocketEvents, WorkerTaskResponse } from "./Models";

const app: express.Application = express();
app.use(bodyParser.json());
app.use(cors());

var http = require("http").Server(app);

var io = require("socket.io")(http);

io.on("connection", (socket: Socket) => {
  console.log("connected", socket.id);
  socket.emit(SocketEvents.MESSAGE, `hello ${socket.id}`);
});

myEmitter.on(MyEmitterEvents.THREAD_RESPONSE, (threadResponse: WorkerTaskResponse) => {
  console.log("an event occurred!", threadResponse.flag);
  io.to(threadResponse.clientId).emit(SocketEvents.MESSAGE, threadResponse);
});

app.get("/health", function (req: express.Request, res: express.Response) {
  res.send(`Hello World! ${new Date()}`);
});

app.post("/execute", function (req: express.Request, res: express.Response) {
  const command = req.body.command as string;
  const clientId = req.body.id;
  runWorkerThread(command, clientId)
    .then(function (result: any) {
      res.status(200).send();
    })
    .catch(function (err) {
      res.send(err);
    });
});

// getpid and kill api are in development
app.get("/getpid", function (req: express.Request, res: express.Response) {
  const pid = req.query.pid as string;
  find("pid", parseInt(pid)).then(
    function (list: any) {
      console.log(list);
      res.send(list);
    },
    function (err: any) {
      console.log(err.stack || err);
      res.send(err);
    }
  );
});

app.post("/kill", function (req: express.Request, res: express.Response) {
  console.log('kill', req.body);
  const pid = req.body.pid as string;
  const id = req.body.id;
  process.kill(parseInt(pid));
  myEmitter.emit("event", id, "Cancelled");
  res.send("Killed");
});

const port = 4000;
http.listen(port, function () {
  console.log("listening on localhost:" + port);
});
