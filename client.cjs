const WebSocket = require('ws');

const websocket = new WebSocket('ws://localhost:8080');

websocket.on('open', () => {
  console.log('Connected to server');
  send('authentification', {
    uuid: undefined,
    username: 'shaynlink'
  })
})

websocket.on('message', (data) => {
  const payload = JSON.parse(data);
  console.log('-> Received message', payload);

  switch (payload.op) {
    case 'authentification':
      console.log('Authentification');
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

websocket.on('error', console.error);
websocket.on('close', () => {
  console.log('Disconnected from server');
});
websocket.on('ping', () => {
  console.log('Heartbeat received');
});