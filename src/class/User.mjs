import { v4 } from 'uuid';
import { shortUnsafeId } from '../helpers/id.mjs';

export default class User {
  constructor() {
    // Create a unique identifier for the user
    this.uuid = v4();
    // Set the default parameters
    this.username = 'Guest ' + shortUnsafeId(9)
    this.color = '#00B4D8';
    this.ws = null;
  }

  // Set the user parameters
  setParameters ({ username, color }) {
    this.username = username ?? this.username;
    this.color = color ?? this.color;
  }

  // Add the ws to the user
  setWs (ws) {
    this.ws = ws;
  }

  // Send a message to the user ws
  send (op, data) {
    this.ws.send(JSON.stringify({
      op,
      d: data
    }));
  }

  // Get node data json compatible
  toJSON () {
    return {
      uuid: this.uuid,
      username: this.username,
      color: this.color
    };
  }
}
