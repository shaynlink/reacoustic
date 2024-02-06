const WebSocket = require('ws');
const axios = require('axios');

const websocket = new WebSocket('ws://localhost:8080');

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })  
}

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

websocket.on('open', async () => {
  console.log('Connected to server');
  // authentificate to server
  send('authentification', {
    uuid: undefined,
    username: 'shaynlink'
  });
})

websocket.on('message', async (data) => {
  const payload = JSON.parse(data);
  console.log('-> Received message', payload);

  switch (payload.op) {
    case 'authentificated':
      console.log('Authentification success : %s (%s)', payload.d.username, payload.d.uuid);
      instance.defaults.headers.common['x-uuid-authorization'] = payload.d.uuid;
      const node = await instance.post('/nodes')
        .then((res) => res.data);
      console.log('Node created', node);
      break;
  }
});

function send (op, data) {
  console.log('<- Send message', { op, data });
  websocket.send(JSON.stringify({
    op,
    d: data
  }));
}

// 1001 Heartbeat timeout
// 1002 need authenticate first
websocket.on('error', console.error);
websocket.on('close', (...args) => {
  console.log('Disconnected from server', ...args);
});
websocket.on('ping', () => {
  console.log('Heartbeat received');
});