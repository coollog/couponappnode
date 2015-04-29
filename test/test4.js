module.exports = function (socket, db, callback) {
  // Test 4 - Customer Register fail //

  var response = 0;
  var message = {
    "email": "jchirik@gmail.com",
    "password": "test"
  };
  
  // login when not registered
  socket.emit('customer login', message);
  socket.on('customer login fail', function (err) {
    if (!response) {
      response = 1;
      // check db here?
      console.log('Test 4 passed ..... attempted customer login (email does not exist)')
      callback();
    }
  });
  socket.on('customer login succeed', function() {
    if (!response) {
      response = 1;
      console.log('Test 4 failed: should not have succeeded');
      callback();
    }
  });
}