const EventEmitter = require("events");
class MyEventEmitter extends EventEmitter {
    static instance: MyEventEmitter;

    private constructor() {
        super();
    }

    public static getInstance(): MyEventEmitter {
        if (!MyEventEmitter.instance) {
            MyEventEmitter.instance = new MyEventEmitter();
        }
        return MyEventEmitter.instance;
    }
}

export default { EventEmitterInstance: MyEventEmitter.getInstance() };