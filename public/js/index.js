const socket = io();

socket.on('connect', () => {
  console.warn('Connected');
});

socket.on('disconnect', () => {
  console.warn('Disconnected');
});

socket.on('newMessage', (message) => {
  console.warn('new message', message);
  let li = jQuery('<li></li>');
  li.text(`${message.from} --> ${message.text}`);
  jQuery('#messages').append(li);
});


jQuery('#message-form').on('submit', (e) => {
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, () => {

  });
});