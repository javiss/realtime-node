const socket = io();

socket.on('connect', () => {
  console.warn('Connected');
});

socket.on('disconnect', () => {
  console.warn('Disconnected');
});

socket.on('newMessage', (message) => {
  console.warn('new message', message);
  let li = jQuery('<li class="collection-item"></li>');
  li.text(`${moment(message.createdAt).format('H:mm')} - ${message.from} --> ${message.text}`);
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', (message) => {
  console.warn('new location message', message);
  let li = jQuery('<li class="collection-item"></li>');
  let a = jQuery('<a target="blank">Here I am!</a>');
  li.text(`${moment(message.createdAt).format('H:mm')} - ${message.from} --> `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});


jQuery('#message-form').on('submit', (e) => {
  e.preventDefault();
  let textField = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: textField.val()
  }, () => {
    textField.val('')
  });
});

let locationButton = jQuery('#send-location');
locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Location not supported by your browser :S');
  }

  locationButton.attr('disabled','disabled');

  navigator.geolocation.getCurrentPosition((location) => {
    locationButton.removeAttr('disabled');
    socket.emit('createLocationMessage', {
      lat: location.coords.latitude,
      lon: location.coords.longitude
    });
  }, () => {
    locationButton.removeAttr('disabled');
    alert('Cant fetch location :(');
  });

});