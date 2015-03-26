// ALL CODE FOR HANDLING SOCKETIO MESSAGES GOES IN THIS FILE
// (though can partition into multiple files)

module.exports = function(server, socket) {
  socket.on('register', function (data) {
    data = util.formJSON(data);

    server.db['users'].insert({
      email: data.email,
      password: data.password
    });

    socket.emit('html', '.content', server.view['login']());

    console.log('new registrant: ' + data.email + ' : ' + data.password);
  });
  socket.on('login', function (data) {
    data = util.formJSON(data);
    
    server.db['users'].findOne({
      email: data.email,
      password: data.password
    }, function (err, doc) {
      if (doc == null) {
        socket.emit('flash', 'login failed');
      } else {
        var locals = {
          email: data.email
        }
        socket.emit('html', '.content', server.view['main'](locals));

        console.log('login by: ' + data.email);
      }
    });
  });

  socket.on('toLogin', function() {
    socket.emit('html', '.content', server.view['login']());
  });
  socket.on('toRegister', function() {
    socket.emit('html', '.content', server.view['register']());
  });
}