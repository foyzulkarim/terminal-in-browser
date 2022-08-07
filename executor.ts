import { Worker } from "worker_threads";
import {
  MyEmitterEvents,
  ThreadEvents,
  WorkerDataType,
  WorkerTaskResponse,
} from "./Models";
import EventEmitter from "./MyEmitter";
const { EventEmitterInstance: myEmitter } = EventEmitter;

export const runWorkerThread = (
  command: string,
  clientId: string,
  shouldAddDocker: boolean = true
) => {
  return new Promise((resolve, reject) => {
    const data: WorkerDataType = {
      command,
      clientId,
      shouldAddDocker,
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
