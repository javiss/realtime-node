const socket = io();

socket.on('connect', () => {
  console.warn('Connected');
});

socket.on('disconnect', () => {
  console.warn('Disconnected');
});

socket.on('newMessage', (message) => {

  let template = jQuery('#message-template').html();

  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: moment(message.createdAt).format('H:mm')
  });

  jQuery('#messages').append(html);

});

socket.on('newLocationMessage', (message) => {

  let template = jQuery('#location-message-template').html();

  let html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: moment(message.createdAt).format('H:mm')
  });

  jQuery('#messages').append(html);
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

  locationButton.attr('disabled', 'disabled');

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