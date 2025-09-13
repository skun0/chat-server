const WebSocket = require('ws');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket listening on ws://localhost:${PORT}`);

let clients = [];

wss.on('connection', (ws) => {
  console.log('New client connected.');

  ws.send('Enter your username:');

  let username = null;

  ws.on('message', (message) => {
    if (!username) {
      username = message.toString();
      ws.send(`${username}, You can now send messages.`);
      console.log(`New User connected: ${username}`);
      return;
    }

    const formattedMessage = `\x1b[33m${username}\x1b[0m: \x1b[37m${message}\x1b[0m`;
    console.log(`${formattedMessage}`);

    clients.forEach(client => {
      if (client.ws !== ws && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(formattedMessage);
      }
    });
  });

  clients.push({ ws, username });

  ws.on('close', () => {
    console.log(`Client ${username || ''} disconnected`);
    clients = clients.filter(client => client.ws !== ws);
  });
});
