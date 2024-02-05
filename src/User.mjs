import { v4 } from 'uuid';

export default class User {
  constructor() {
    this.uuid = v4();
    this.username = 'no name';
    this.color = '#00B4D8';
    this.ws = null;
  }
  setParameters ({ username, color }) {
    this.username = username ?? this.username;
    this.color = color ?? this.color;
  }

  setWs (ws) {
    this.ws = ws;
  }

  send (op, data) {
    this.ws.send(JSON.stringify({
      op,
      d: data
    }));
  }

  toJSON () {
    return {
      uuid: this.uuid,
      username: this.username,
      color: this.color
    };
  }
}
