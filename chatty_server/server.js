const express = require('express');
const SocketServer = require('ws').Server;
const ws = require('ws');
const uuidv1 = require('uuid/v1');

const PORT = 3001;
//Create a new express server
const server = express()
//make the express server serve static assets (html, js, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${PORT}`));
//Create the WebSockets server
const wss = new SocketServer({server});
//Set up a callback that will run when a client connects to the server
//When a client connects they are assigned a socket, represented by the ws parameter in the callback
wss.on('connection', (ws) => {
  console.log('Client connected');

  const userChangeMessage = {
    type: "userCountChanged",
    userCount: wss.clients.size,
    id: uuidv1()
  }
  broadcastMessage(JSON.stringify(userChangeMessage));

  ws.on('close', () => {
    console.log('Client disconnected')
    const userChangeMessage = {
      type: "userCountChanged",
      userCount: wss.clients.size,
      id: uuidv1()
    }
    broadcastMessage(JSON.stringify(userChangeMessage))
  })
});

wss.on('connection', handleConnection);

function handleConnection(client) {
  client.on('message', handleMessage);
}

let contents = '';
function handleMessage(message) {
  const parsedMsg = JSON.parse(message);
  switch(parsedMsg.type) {
    case "postNotification":
      parsedMsg.type = "incomingNotification"
      parsedMsg['notificationId'] = uuidv1();
      contents = JSON.stringify(parsedMsg);
      broadcastMessage(contents);
      break;
    case "postMessage":
      parsedMsg.type = "incomingMessage";
      parsedMsg['id'] = uuidv1();
      contents = JSON.stringify(parsedMsg);
      broadcastMessage(contents);
      break;
    default:
      throw new Error("Unknown event type")
  }
}

function broadcastMessage(message) {
  for (let client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(message);
    }
  }
}

