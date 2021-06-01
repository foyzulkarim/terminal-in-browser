import { Worker, workerData, WorkerOptions } from "worker_threads";
import { exec } from "child_process";

export const run = (c: string) => {
  return new Promise((resolve, reject) => {
    const data = {
      command: c,
    };

    const worker = new Worker("./worker.js", { workerData: data });
    worker.on("message", (msg) => {
      resolve(msg);
    });

    worker.on("error", (err) => reject(err));
  });
};
