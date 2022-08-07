#!/usr/bin/env zx

import express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");

import EventEmitter from "./MyEmitter";
const { EventEmitterInstance: myEmitter } = EventEmitter;

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
  socket.on("disconnect", (reason) => {
    const stopAndRemoveDockerContainerCommand = `docker stop ${socket.id} && docker rm ${socket.id}`;
    runWorkerThread(stopAndRemoveDockerContainerCommand, socket.id, false).then(
      (result) => {
        console.log(
          `docker container ${socket.id} stopped and removed`,
          result
        );
      }
    );
  });
  const startNewDockerCommand = `docker run --name ${socket.id} -id alpine`;
  runWorkerThread(startNewDockerCommand, socket.id, false)
    .then(function (result: any) {
      console.log(`docker container ${socket.id} started`, result);
      socket.emit(SocketEvents.MESSAGE.toString(), `hello from ${socket.id}`);
    })
    .catch(function (err) {
      socket.emit(
        SocketEvents.MESSAGE,
        `Error occurred while spinning container ${socket.id}`
      );
    });
});

myEmitter.on(
  MyEmitterEvents.THREAD_RESPONSE,
  (threadResponse: WorkerTaskResponse) => {
    console.log("an event occurred!", threadResponse.flag);
    io.to(threadResponse.clientId).emit(SocketEvents.MESSAGE, threadResponse);
  }
);

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

app.post("/kill", function (req: express.Request, res: express.Response) {
  console.log("kill", req.body);
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
