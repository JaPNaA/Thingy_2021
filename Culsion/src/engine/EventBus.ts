import { removeElmFromArray } from "./util/removeElmFromArray";

type Handler = (data?: any) => void;

export class EventBus {
    private map: { [x: string]: ((EventBus | Handler)[] | undefined) } = {};
    private parentBus?: EventBus;

    private stoppingPropagation = false;

    /**
     * Sends a message along the event bus
     * @param name Name of event
     * @param data Additional data
     */
    public send(name: string, data?: any) {
        const arr = this.map[name];
        if (!arr) { return; }

        this.stoppingPropagation = false;

        for (let i = arr.length - 1; i >= 0; i--) {
            const handler = arr[i];
            if (handler instanceof EventBus) {
                handler.send(name);
            } else {
                handler(data);
            }
            if (this.stoppingPropagation) {
                this.stoppingPropagation = false;
                break;
            }
        }
    }

    /**
     * Stops propagation of any message being sent
     */
    public stopPropagation() {
        this.stoppingPropagation = true;
        if (this.parentBus) {
            this.parentBus.stopPropagation();
        }
    }

    /**
     * Subscribe to an event
     * @param name Name of event
     * @param handler Event handler
     */
    public subscribe(name: string, handler: Handler | EventBus) {
        const existingArr = this.map[name];
        if (existingArr) {
            existingArr.push(handler);
        } else {
            this.map[name] = [handler];
            if (this.parentBus) {
                this.parentBus.subscribe(name, this);
            }
        }
    }

    public unsubscribe(name: string, handler: Handler | EventBus) {
        const arr = this.map[name]!;
        removeElmFromArray(handler, arr);
        if (!arr.length) {
            this.map[name] = undefined;
            if (this.parentBus) {
                this.parentBus.unsubscribe(name, this);
            }
        }
    }

    public _attach(bus: EventBus) {
        this.parentBus = bus;

        const listeningNames = Object.keys(this.map);
        for (const name of listeningNames) {
            bus.subscribe(name, this);
        }
    }

    public _dispose() {
        if (!this.parentBus) { return; }

        const listeningNames = Object.keys(this.map);
        for (const name of listeningNames) {
            this.parentBus.unsubscribe(name, this);
        }
    }
}
