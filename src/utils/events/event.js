export class Event {
    constructor() {
        /**
         * @type {Function[]}
         */
        this.listeners = [];
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    raiseEvent(sender, ...args) {
        this.listeners.forEach(listener => listener.call(this, sender, ...args));
    }

    removeListener(listener) {
        let index = this.listeners.indexOf(listener);
        if (index > -1) this.listeners.splice(index, 1);
    }
}