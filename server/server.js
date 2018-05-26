const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const PORT = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app);
const io = socketIO(server);

const {generateMessage, generateLocationMessage} = require('./utils/message');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (message,callback) => {
    io.emit('newMessage', generateMessage(message.from, message.text));
    console.log(message);
    callback('This is from the server');
  });

  socket.on('createLocationMessage', (message) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', message.lat, message.lon));
    console.log(message);
  });

  socket.on('disconnect', () => {
    console.warn('User disconnected');
  });

});

server.listen(PORT, () => {
  console.log('Server is up, port --> ' + PORT);
});
