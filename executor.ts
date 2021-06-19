import { Worker, workerData, WorkerOptions } from "worker_threads";
import { MyEmitterEvents, ThreadEvents, WorkerDataType, WorkerTaskResponse } from "./Models";
import EventEmitter from "./MyEmitter";
const { EventEmitterInstance: myEmitter } = EventEmitter;

class AppWorker extends Worker {
  constructor(fileName: string, parameter: WorkerDataType) {
    super(fileName, { workerData: parameter });
  }
}

export const runWorkerThread = (command: string, clientId: string) => {
  return new Promise((resolve, reject) => {
    const data: WorkerDataType = {
      command,
      clientId,
    };

    const worker = new Worker("./worker.js", { workerData: data });
    worker.on(ThreadEvents.MESSAGE, (threadResponse: WorkerTaskResponse) => {
      console.log("resolving", threadResponse.flag);
      myEmitter.emit(MyEmitterEvents.THREAD_RESPONSE, threadResponse);
      resolve(threadResponse);
    });

    worker.on("error", (err) => reject(err));
  });
};
