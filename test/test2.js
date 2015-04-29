module.exports = function (socket, db, callback) {
  // Test 2 -- Customer Register fail //

  var response = 0;
  var message = {
    "email": "jchirik@gmail.com",
    "password": "test",
    "firstname": "John",
    "lastname": "Apples"
  };
  socket.emit('customer register', message);

  // try after email has already been created
  socket.on('customer register succeed', function() {
    socket.emit('customer register', message);
    socket.on('customer register fail', function (err) {
      if (!response) {
        response = 1;
        succeed('attempted customer register (email already taken)', callback);
      }
    })
    socket.on('customer register succeed', function() {
      if (!response) {
        response = 1;
        fail('should not have succeeded', callback);
      }
    });
  });
}