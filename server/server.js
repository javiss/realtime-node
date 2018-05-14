const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const PORT = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected');

  socket.emit('newMessage', {
    from: 'kediseloco@ke.dise',
    text: 'cries in nodejs',
    createdAt: 123123
  });


  socket.on('createMessage', (message) => {
    console.log('createEmail', message);
  });

  socket.on('disconnect', () => {
    console.warn('User disconnected');
  });



});

server.listen(PORT, () => {
  console.log('Server is up, port --> ' + PORT);
});
