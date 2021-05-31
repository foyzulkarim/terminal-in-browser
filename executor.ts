console.log("hello world");
import { Worker, workerData, WorkerOptions } from "worker_threads";
import { exec } from "child_process";

const run = () => {
  const data = {   
    command: "ls -la",
  };

  const worker = new Worker("./worker.js", { workerData: data });
  worker.on("message", (msg) => {
    console.log("Message", msg);
  });
  worker.on("exit", (code) => {
    console.log("Bye bye", code);
  });
};

run();
