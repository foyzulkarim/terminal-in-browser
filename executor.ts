import { Worker, workerData, WorkerOptions } from "worker_threads";
import { exec } from "child_process";
import { Socket } from "socket.io";

export const run = (c: string[], socket: Socket) => {
  return new Promise((resolve, reject) => {
    const data = {
      command: c,
    };

    const worker = new Worker("./worker.js", { workerData: data });
    worker.on("message", (msg) => {
      console.log('resolving', msg);      
      resolve(msg);
      socket.emit("hello", msg);
    });

    worker.on("error", (err) => reject(err));
  });
};
