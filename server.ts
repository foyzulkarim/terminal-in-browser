import express = require("express");
var cors = require("cors");
var bodyParser = require('body-parser')

const find = require("find-process");
import { Server, Socket } from "socket.io";
import { run } from "./executor";
// Create a new express app instance
const app: express.Application = express();
app.use(bodyParser.json())
app.use(cors());

var http = require("http").Server(app);

var io = require("socket.io")(http);
let socket: Socket;

io.on("connection", (s: Socket) => {
  console.log("connected");
  socket = s;
  socket.emit("hello", new Date());
});

app.get("/", function (req: express.Request, res: express.Response) {
  res.send(`Hello World! ${new Date()}`);
});

app.get("/execute", function (req: express.Request, res: express.Response) {
  const command = req.query.command as string;
  const commands = command.split('&&');
  run(command,  socket)
    .then(function (result: any) {
      // console.log(result);      
      res.status(200).send();
    })
    .catch(function (err) {
      res.send(err);
    });
});

app.post("/execute", function (req: express.Request, res: express.Response) {
  const command = req.body.command as string;
  const commands = command.split('&&');
  run(command,  socket)
    .then(function (result: any) {
      // console.log(result);      
      res.status(200).send();
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

// app.listen(4000, function() {
//   console.log('listening on localhost:4000');
// });
const port = 4000;
http.listen(port, function () {
  console.log("listening on localhost:" + port);
});
