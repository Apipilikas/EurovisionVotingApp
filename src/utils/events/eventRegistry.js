import { Event } from "./event";

export class EventRegistry extends Map {
    constructor() {
        super();
    }

    registerEvent(eventName) {
        this.set(eventName, new Event());
    }

    addListener(eventName, listener) {
        let event = this.get(eventName);

        if (event != null) {
            event.addListener(listener);
        }
    }

    raiseEvent(eventName, sender, ...args) {
        let event = this.get(eventName);

        if (event != null) {
            event.raiseEvent(sender, ...args);
        }
    }

    removeListener(eventName, listener) {
        let event = this.get(eventName);

        if (event != null) {
            event.removeListener(listener);
        }
    }

    clearListeners(eventName) {
        let event = this.get(eventName);

        if (event != null) {
            event.listeners = [];
        }
    }

    clearAllListeners() {
        this.forEach((key, value) => this.clearListeners(key));
    }
}