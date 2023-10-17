import InstaLogEvent from '../../types/event'


class InstaLog {
  secretKey: string;
  events: InstaLogEvent[];
  constructor(secretKey: string) {
    this.secretKey = secretKey;
    this.events = []
  }
  listEvents() {
    return this.events
  }
  createEvent(event: InstaLogEvent) {
    this.events.unshift(event)
    return event
  }
}

export default InstaLog;