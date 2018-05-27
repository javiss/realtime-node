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
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

app.use(express.static(publicPath));

let users = new Users();

io.on('connection', (socket) => {
  console.log('new user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.username) || !isRealString(params.room)) {
      return callback('Username and/or room name not valid!')
    }
    socket.join(params.room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.username, params.room);


    socket.emit('newMessage', generateMessage('Admin', 'Welcome'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.username} joined !`));
    io.to(params.room).emit(('updateUsersList'), users.getUserList(params.room));
    callback();
  });

  socket.on('createMessage', (message, callback) => {

    let user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
      callback('This is from the server');
    }

  });

  socket.on('createLocationMessage', (message) => {
    let user = users.getUser(socket.id);
    io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, message.lat, message.lon));
    console.log(message);
  });

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} left :(`));
    }
    console.warn('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log('Server is up, port --> ' + PORT);
});
