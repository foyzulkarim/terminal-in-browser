import express = require("express");
const find = require("find-process");
import { Server, Socket } from "socket.io";
import { run } from "./executor";
// Create a new express app instance
const app: express.Application = express();

const httpServer = require("http").createServer(app);
const options = {  };
const io = require("socket.io")(httpServer, options);

io.on("connection", (socket: Socket) => {
  console.log('connected');
});

app.get("/", function (req: express.Request, res: express.Response) {
  console.log(req.params, req.query);
  res.send("Hello World!");
});

app.get("/execute", function (req: express.Request, res: express.Response) {
  const command = req.query.command as string;
  run(command)
    .then(function (result: any) {
      // console.log(result);
      res.send(result.data);
    })
    .catch(function (err) {
      res.send(err);
    });
});

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

app.get("/kill", function (req: express.Request, res: express.Response) {
  const pid = req.query.pid as string;
  process.kill(parseInt(pid));
  res.send("Killed");
});

app.listen(3000, function () {
  console.log("App is listening on port 3000!");
});
