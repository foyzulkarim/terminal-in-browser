import { parentPort, workerData, MessagePort } from "worker_threads";
import { exec, ChildProcess } from "child_process";

const cb = (e: any, d: string, se: string): void => {
  console.log("DONE", d);

  const p = parentPort as MessagePort;
  p.postMessage({ flag: "END", pid: proc.pid, data: d, id: workerData.id });
};

const proc: ChildProcess = exec(workerData.command, cb);
console.dir(proc.pid);
if (proc != null && proc.stdout != null) {
  proc.stdout.on("data", (data: string) => {
    console.log("ONGOING",workerData.id, data);
    const p = parentPort as MessagePort;
    const msg = {
      flag: "ONGOING",
      pid: proc.pid,
      data: data,
      id: workerData.id,
    };    
    p.postMessage(msg);
  });
}

// var exec_commands = (commands: string[]) => {
//   var command = commands.shift();
//   if (command) {
//     const cb = (e: any, d: string, se: string): void => {
//       console.log("DONE", d);

//       const p = parentPort as MessagePort;
//       p.postMessage({ flag: "END", pid: proc.pid, data: d });
//     };
//     const proc: ChildProcess = exec(command, cb);
//     console.dir(proc.pid);
//     if (proc != null && proc.stdout != null) {
//       proc.stdout.on("data", (data: string) => {
//         console.log("ONGOING", data);
//         const p = parentPort as MessagePort;
//         p.postMessage({ flag: "ONGOING", pid: proc.pid, data: data });
//       });
//     }
//     if (commands.length) exec_commands(commands);
//   }
// };

// exec_commands(workerData.command);
