import { Worker, workerData, WorkerOptions } from "worker_threads";

export const run2 = (c: string, id: string, myEmitter: any) => {
  return new Promise((resolve, reject) => {
    const data = {
      command: c,
      id: id,
    };

    const worker = new Worker("./worker.js", { workerData: data });
    worker.on("message", (msg) => {
      console.log("resolving", id, msg);
      myEmitter.emit("event", id, msg);
      resolve(msg);
      // socket.emit("hello", msg);
    });

    worker.on("error", (err) => reject(err));
  });
};
