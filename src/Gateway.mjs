import { WebSocketServer } from 'ws';
import express from 'express';
import http from 'node:http';
import Collection from './helpers/Collection.mjs';
import User from './class/User.mjs';
import handler from './Handler.mjs';

export default class Gateway {
  constructor () {
    // Create a new WebSocket server instance with no-server
    this.wss = new WebSocketServer({
      // Enable permessage-deflate compression
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: 1024,
          memLevel: 7,
          level: 3
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024
        },
        threshold: 1024
      },
      // No server instance
      noServer: true
    });

    // Create a http handler with express
    this.app = express();

    this.server = null;

    // Initialize the Gateway
    this._init();

    // Data storage
    this.nodes = new Collection();
    this.users = new Collection();
  }

  _init () {
    // Use heartbeat to keep the connection alive
    // and avoid zombie connections
    function heartbeat() {
      console.log('-> Received heartbeat');
      this.isAlive = true;
    }

    this.wss.on('connection', (ws) => {
      ws.isAlive = true;
      // Log ws errors
      ws.on('error', console.error);
      // When receive pong, reset the heartbeat
      ws.on('pong', heartbeat);
      // Handle messages
      ws.on('message', (message) => this.onMessage(ws, message));
    })
    
    // Set the heartbeat interval
    const interval = setInterval(() => {
      // For each clients check if the heartbeat is alive
      this.wss.clients.forEach((ws) => {
        if (ws.isAlive === false) return ws.terminate(1001, 'Heartbeat timeout');

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000)

    // Clear the interval when the server is closed
    this.wss.on('close', () => {
      clearInterval(interval);
    })

    // Bind the handler to the app
    const _handler = handler.bind(this);

    // Call the handler
    _handler()
  }

  onMessage (ws, message) {
    // Parse JSON-string message to Object
    const payload = JSON.parse(message);
    console.log('-> Received message', payload)

    console.log('ws.uuid', ws.uuid);

    // If the user is not authenticated, terminate the connection with 1002 code
    if (payload.op !== 'authentification' && !this.users.has(ws.uuid)) {
      // 1005 need authenticate first
      ws.terminate(1002, 'Need authenticate first');
      return;
    }

    switch (payload.op) {
      case 'authentification':
        // Authentificate the user
        this.authentificate(ws, payload.d);
        break;
      default:
        console.error('Unknown message type');
    }
  }

  authentificate (ws, userInfo) {
    /**
     * Create or get the user
     * @type {User}
     */
    let user;
    if (userInfo.uuid) {
      user = this.users.getOrCreate(userInfo.uuid, new User());
    } else {
      user = new User();
      this.users.set(user.uuid, user);
    }

    // Add the ws to the user
    user.setWs(ws);

    // Set the user parameters
    user.setParameters({
      username: userInfo.username,
      color: userInfo.color
    });

    // Set the ws uuid
    ws.uuid = user.uuid;

    // Send the authentificated message
    user.send('authentificated', user.toJSON());
  }

  send (ws, op, data) {
    console.log('<- Send message', { op, data });
    ws.send(JSON.stringify({
      op,
      d: data
    }));
  }

  createServer () {
    // Create a server with the express app
    this.server = http.createServer(this.app);
    // Listen on port 8080
    this.server.listen(process.env.PORT || 8080);
    this.server.on('listening', () => {
      console.log('Server is listening on port 8080');
    })
    // Handle the upgrade event
    this.server.on('upgrade', (req, socket, head) => {
      // Handle the upgrade event with the WebSocket server
      this.wss.handleUpgrade(req, socket, head, (ws) => {
        this.wss.emit('connection', ws, req);
      })
    })
  }
}