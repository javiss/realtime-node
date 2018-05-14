const socket = io();

socket.on('connect', () => {
  console.warn('Connected');
  socket.emit('createEmail', {
    to: 'keablalocoo@loco.lo',
    text: 'o ke ase?'
  });
});

socket.on('disconnect', () => {
  console.warn('Disconnected');
});

socket.on('newMessage', (message) => {
  console.warn('new message', message)
});

socket.emit('createMessage', {
  from: 'Javi',
  text: 'Kedise'
});
