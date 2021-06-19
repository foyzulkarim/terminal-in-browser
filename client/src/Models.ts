export class WorkerTaskResponse {
    flag!: string;
    pid!: number;
    clientId!: string;
    data!: string;
}

export enum MyEmitterEvents {
    THREAD_RESPONSE
}

export enum SocketEvents {
    MESSAGE = "message"
}

export enum ProcessFlags {
    ONGOING = "ongoing", DONE = "done", ERROR = "error"
}