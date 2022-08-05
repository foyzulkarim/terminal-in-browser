import { parentPort, workerData, MessagePort } from "worker_threads";
import { exec, ChildProcess } from "child_process";
import { WorkerDataType, WorkerTaskResponse, ProcessFlags } from "./Models";

const dataParameter: WorkerDataType = workerData as WorkerDataType;

const callbackFn = (errror: any, data: string): void => {
  // console.log("DONE", d);
  const parent = parentPort as MessagePort;
  const processResponse: WorkerTaskResponse = {
    flag: ProcessFlags.DONE.toString(),
    pid: proc.pid,
    data: data,
    clientId: dataParameter.clientId,
  };
  parent.postMessage(processResponse);
};

const STDOUT_ON_DATA_EVENT = "data";
console.log("executing...");
const proc: ChildProcess = exec(dataParameter.command, callbackFn);
console.dir(proc.pid);
if (proc != null && proc.stdout != null) {
  proc.stdout.on(STDOUT_ON_DATA_EVENT, (data: string) => {
    console.log("ONGOING", dataParameter.clientId, data);
    const parent = parentPort as MessagePort;
    const processResponse: WorkerTaskResponse = {
      flag: ProcessFlags.ONGOING.toString(),
      pid: proc.pid,
      data: data,
      clientId: dataParameter.clientId,
    };
    parent.postMessage(processResponse);
  });
}
