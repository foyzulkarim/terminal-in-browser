import { parentPort, workerData, MessagePort } from "worker_threads";
import { exec } from "child_process";

const cb = (e: any, d: string, se: string): void => {
  const p = parentPort as MessagePort;
  p.postMessage(d);
};

exec(workerData.command, cb);