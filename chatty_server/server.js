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
//Set up a callback that will run when a clicne connects tot he server
//When a client connects they are assigned a socket, represented by the ws parameter in the callback
wss.on('connection', (ws) => {
  console.log('Client connected');
  // ws.on('message', function incoming(message) {
  //   console.log('received: %s', message);
  // });
  ws.on('close', () => console.log('Client disconnected'));
});


function broadcastMessage(message) {
  for (let client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(message);
    }
  }
}

let contents = '';
function handleMessage(message) {
  // console.log('NEW MESSAGE!');

  const parsedMsg = JSON.parse(message);
  console.log("message:", parsedMsg.type);

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
      throw new Error(`Unknown event type`)
  }
}

function handleConnection(client) {
  client.on('message', handleMessage);
  // Send this new person the current state of the document!
  //client.send(contents);
}

wss.on('connection', handleConnection);

