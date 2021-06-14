import { parentPort, workerData, MessagePort } from "worker_threads";
import { exec, ChildProcess } from "child_process";

const cb = (e: any, d: string, se: string): void => {
  console.log('DONE',d);
  
  const p = parentPort as MessagePort;
  p.postMessage({flag: 'END', data: d});
};

const proc: ChildProcess = exec(workerData.command, cb);
console.dir(proc.pid);
if (proc != null && proc.stdout != null) {
  proc.stdout.on("data", (data: string) => {
    // console.log('ONGOING', data);
    // const p = parentPort as MessagePort;
    //p.postMessage({flag: 'ONGOING', data: data});
  });
}
