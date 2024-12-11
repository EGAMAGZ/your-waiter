import EventEmitter from "events";

export default class NotificationOrderController {
    private static instance: NotificationOrderController;
    private emitter = new EventEmitter();

    private constructor() {}

    static getInstance(): NotificationOrderController {
        if (!NotificationOrderController.instance) {
            NotificationOrderController.instance = new NotificationOrderController();
        }
        return NotificationOrderController.instance;
    }

    public subscribe(callback: (data: any) => void) {
        this.emitter.on("message", callback);
    }

    public unsubscribe(callback: (data: any) => void) {
        this.emitter.off("message", callback);
    }

    public sendNotification(data: any): void {
        console.log("Emit");
        this.emitter.emit("message", data);
    }
}
