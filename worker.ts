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
let command = `${dataParameter.command}`;
if (dataParameter.shouldAddDocker) {
  command = `docker exec ${dataParameter.clientId} ${command}`;
}

// const proc: ChildProcess = exec(`docker exec -it ${dataParameter.clientId} ${dataParameter.command}`, callbackFn);
const proc: ChildProcess = exec(command, callbackFn);

console.dir(command, proc.pid);
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
