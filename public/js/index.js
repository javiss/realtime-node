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

socket.on('newLocationMessage', (message) => {
  console.warn('new location message', message);
  let li = jQuery('<li></li>');
  let a = jQuery('<a target="blank">Here I am!</a>');
  li.text(`${message.from} --> `);
  a.attr('href', message.url);
  li.append(a);
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

let locationButton = jQuery('#send-location');
locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Location not supported by your browser :S');
  }

  navigator.geolocation.getCurrentPosition((location) => {
    socket.emit('createLocationMessage', {
      lat: location.coords.latitude,
      lon: location.coords.longitude
    });
  }, () => {
    alert('Cant fetch location :(');
  });

});