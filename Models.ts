export class WorkerDataType {
  command!: string;
  clientId!: string;
  shouldAddDocker!: boolean;
  constructor() {
    this.shouldAddDocker = true;
  }
}

export class WorkerTaskResponse {
  flag!: string;
  pid!: number;
  clientId!: string;
  data!: string;
}

export enum MyEmitterEvents {
  THREAD_RESPONSE = "thread-response",
}

export enum ThreadEvents {
  MESSAGE = "message",
}

export enum SocketEvents {
  MESSAGE = "message",
}

export enum ProcessFlags {
  ONGOING = "ongoing",
  DONE = "done",
  ERROR = "error",
}
