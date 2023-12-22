// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let connectedUsers = [];
let chatHistory = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send chat history to the new user
  if (chatHistory.length > 0) {
    socket.emit('chatHistory', chatHistory);
  }

  connectedUsers.push(socket.id);
  io.emit('userList', connectedUsers);

  socket.on('message', (msg) => {
    console.log('Received message:', msg);

    // Save the chat history
    chatHistory.push(msg);

    // Keep only the last 10 messages in the history
    if (chatHistory.length > 10) {
      chatHistory.shift();
    }

    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    connectedUsers = connectedUsers.filter((user) => user !== socket.id);
    io.emit('userList', connectedUsers);
  });
});

const port = 30222;
server.listen(port, () => {
  console.log(`WebSocket server listening on port ${port}`);
});
