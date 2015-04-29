module.exports = function (socket, db, callback, fail, pass) {
  // Test 8 - Business Login pass //

  var response = 0;
  var message = {
    "email": "tniels@business.com",
    "password": "test"
  };
  socket.emit('business register', message);

  // login after registered
  socket.on('business register succeed', function() {
    socket.emit('business login', message);

    socket.on('business login fail', function (err) {
      if (!response) {
        response = 1;
        fail(err, callback);
      }
    });

    socket.on('business login succeed', function() {
      if (!response) {
        response = 1;
        // check database for business information
        db.collection('businesses').findOne(message, function (err, doc) {
          if (err == null && doc != null) {
            pass('existing business login', callback);
          } else {
            fail(err, callback);
          }
        });
      }
    });
  });
}