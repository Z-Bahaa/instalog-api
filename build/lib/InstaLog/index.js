"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InstaLog {
    constructor(secretKey) {
        this.secretKey = secretKey;
        this.events = [];
    }
    listEvents() {
        return this.events;
    }
    createEvent(event) {
        this.events.unshift(event);
        return event;
    }
}
exports.default = InstaLog;
