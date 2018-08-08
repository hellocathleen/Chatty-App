const express = require('express');
const SocketServer = require('ws').Server;
const ws = require('ws');

const PORT = 3001;
//Create a new express server
const server = express()
//make the express server serve static assets (html, js, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${PORT}`));
//Create the WebSockets server
const wss = new SocketServer({server});
//Set up a callback that will run when a clicne connects tot he server
//When a client connects they are assigned a socket, represented by the ws parameter in the callback
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  ws.on('close', () => console.log('Client disconnected'));
});

let contents = '';
function broadcastMessage(message) {
  for (let client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(message);
    }
  }
}

function handleMessage(message) {
  // console.log('NEW MESSAGE!');
  // console.log(message);
  contents = message;
  broadcastMessage(contents);
}

function handleConnection(client) {
  client.on('message', handleMessage);
  // Send this new person the current state of the document!
  client.send(contents);
}

wss.on('connection', handleConnection);

