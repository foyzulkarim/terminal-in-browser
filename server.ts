import express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
const find = require("find-process");
import { Socket } from "socket.io";
import { run2 } from "./executor";
// Create a new express app instance
const app: express.Application = express();
app.use(bodyParser.json());
app.use(cors());

var http = require("http").Server(app);

var io = require("socket.io")(http);
let socket: Socket;

io.on("connection", (s: Socket) => {
  console.log("connected", s.id);
  socket = s;
  socket.emit("hello", `hello ${s.id}`);
});

myEmitter.on("event", (id: string, msg: string) => {
  console.log("an event occurred!", id, msg);
  io.fetchSockets().then((sockets: Socket[]) => {
    console.log(
      "sockets",
      sockets.map((x) => x.id)
    );
  });

  io.to(id).emit("hello", msg);
  // socket.emit("hello", msg);
});

app.get("/", function (req: express.Request, res: express.Response) {
  res.send(`Hello World! ${new Date()}`);
});
 

app.post("/execute", function (req: express.Request, res: express.Response) {
  const command = req.body.command as string;
  const id = req.body.id;
  run2(command, id, myEmitter)
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
