const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: 'wss://chat-cheetah.onrender.com' } });

const PORT = 3001;
const messages = [];

io.on('connection', (socket) => {
  console.log('Usuário conectado!', socket.id);
  socket.emit('receive_message', messages);

  socket.on('set_username', (username) => {
    if (username.toLowerCase() === 'você' || username.toLowerCase() === 'sistema') {
      socket.emit('error_message', 'Este nome de usuário não pode ser utilizado.');
      return;
    }

    const isNameTaken = [...io.sockets.sockets.values()].some(s => s.data.username?.toLowerCase() === username.toLowerCase());
    if (isNameTaken) {
      socket.emit('error_message', 'Este nome de usuário já está em uso.');
      return;
    }

    socket.data.username = username;

    const joinMessage = {
      text: `${username} entrou no chat`,
      authorId: 'system',
      author: 'Sistema',
      systemMessage: true,
    };
    messages.push(joinMessage);
    io.emit('receive_message', joinMessage);

    socket.emit('username_set');
  });

  socket.on('message', (text) => {
    const messageData = {
      text,
      authorId: socket.id,
      author: socket.data.username,
    };
    messages.push(messageData);
    io.emit('receive_message', messageData);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado!', socket.id);
  });
});

server.listen(PORT, () => console.log('Server running...'));
