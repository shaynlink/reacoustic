import { WebSocketServer } from 'ws';
import express from 'express';
import http from 'node:http';
import Collection from './Collection.mjs';
import User from './User.mjs';

export default class Gateway {
  constructor () {
    this.wss = new WebSocketServer({
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
      noServer: true
    });

    this.app = express();

    this.server;

    this._init();

    this.nodes = new Collection();
    this.users = new Collection();
  }

  _init () {
    function heartbeat() {
      console.log('-> Received heartbeat');
      this.isAlive = true;
    }

    this.wss.on('connection', (ws) => {
      ws.isAlive = true;
      ws.on('error', console.error);
      ws.on('pong', heartbeat);
      ws.on('message', (message) => this.onMessage(ws, message));
    })

    const interval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        console.log(ws.isAlive);
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000)

    this.wss.on('close', () => {
      clearInterval(interval);
    })
  }

  onMessage (ws, message) {
    const payload = JSON.parse(message);
    console.log('-> Received message', payload)

    switch (payload.op) {
      case 'authentification':
        this.authentificate(ws, payload.d);
        break;
      case 'createNode':
        this.addNode(payload.d);
        break;
      default:
        console.error('Unknown message type');
    }
  }

  authentificate (ws, userInfo) {
    let user;
    if (userInfo.uuid) {
      user = this.users.getOrCreate(userInfo.uuid, new User());
    } else {
      user = new User();
      this.users.set(user.uuid, user);
    }

    user.setWs(ws);

    user.setParameters({
      username: userInfo.username,
      color: userInfo.color
    });

    user.send({
      op: 'authentification',
      d: user.toJSON()
    })
  }

  addNode ({ parameters, user }) {

  }

  send (ws, op, data) {
    console.log('<- Send message', { op, data });
    ws.send(JSON.stringify({
      op,
      d: data
    }));
  }

  createServer () {
    this.server = http.createServer(this.app);
    this.server.listen(8080);
    this.server.on('listening', () => {
      console.log('Server is listening on port 8080');
    })
    this.server.on('upgrade', (req, socket, head) => {
      this.wss.handleUpgrade(req, socket, head, (ws) => {
        this.wss.emit('connection', ws, req);
      })
    })
  }
}