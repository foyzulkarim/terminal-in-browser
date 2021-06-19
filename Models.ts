export class WorkerDataType {
    command!: string;
    clientId!: string;

    // constructor(command: string, clientId: string) {
    //     this.command = command;
    //     this.clientId = clientId;
    // }
}


export class WorkerTaskResponse {
    flag!: string;
    pid!: number;
    clientId!: string;
    data!: string;
}

export enum MyEmitterEvents {
    THREAD_RESPONSE = 'thread-response'
}

export enum ThreadEvents {
    MESSAGE = "message"
}

export enum SocketEvents {
    MESSAGE = "message"
}

export enum ProcessFlags {
    ONGOING = "ongoing", DONE = "done", ERROR = "error"
}
