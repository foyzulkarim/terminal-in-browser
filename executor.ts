import { Worker, workerData, WorkerOptions } from "worker_threads";
import { exec } from "child_process";

export const run = (c: string) => {
  const data = {
    command: c,
  };

  const r = (m: string): string => {
    return m;
  };

  const worker = new Worker("./worker.js", { workerData: data });
  worker.on("message", (msg) => {
    console.log(msg);
    return r(msg);
  });
};
