import { parentPort, workerData, MessagePort } from "worker_threads";
import { exec, ExecException } from "child_process";

console.log("Executing", workerData);

const cb = (e: any, d: string, se: string): void => {
  const p = parentPort as MessagePort;
  // console.log("cb", p);
  p.postMessage(d);
};

// exec(workerData.command, (error, stdout, stderr) => {
//   const p = parentPort as MessagePort;
//   console.log("response", p);
// });

exec(workerData.command, cb);

console.log("Done");
