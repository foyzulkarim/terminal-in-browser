import express = require("express");
import { run  } from "./executor";
// Create a new express app instance
const app: express.Application = express();

app.get("/", function (req: express.Request, res: express.Response) {
  console.log(req.params, req.query);
  res.send("Hello World!");
});

app.get("/execute", function (req: express.Request, res: express.Response) {
  const command = req.query.command as string;
  const output = run(command);
  res.send(output);
});

app.listen(3000, function () {
  console.log("App is listening on port 3000!");
});
