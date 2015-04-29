module.exports = function (socket, db, callback, fail, pass) {
  // Test 9 - Business Login fail //

  var response = 0;
  var message = {
    "email": "tniels@business.com",
    "password": "test"
  };
  
  // login when not registered
  socket.emit('business login', message);
  socket.on('business login fail', function (err) {
    if (!response) {
      response = 1;
      pass('attempted business login (email does not exist)', callback);
    }
  });
  socket.on('business login succeed', function() {
    if (!response) {
      response = 1;
      fail('should not have succeeded', callback);
    }
  });
}