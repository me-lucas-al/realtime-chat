const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

const PORT = 3001;
const messages = [];

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

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
