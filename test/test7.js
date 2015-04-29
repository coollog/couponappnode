module.exports = function (socket, db, callback, fail, pass) {
  // Test 7 -- Business Register fail //

  var response = 0;
  var message = {
    "email": "tniels@business.com",
    "password": "test",
    "firstname": "Torie",
    "lastname": "Oranges"
  };
  socket.emit('business register', message);

  // try after email has already been created
  socket.on('business register succeed', function() {
    socket.emit('business register', message);
    socket.on('business register fail', function (err) {
      if (!response) {
        response = 1;
        pass('attempted business register (email already taken)', callback);
      }
    })
    socket.on('business register succeed', function() {
      if (!response) {
        response = 1;
        fail('should not have succeeded', callback);
      }
    });
  });
}