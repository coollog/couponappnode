module.exports = function (socket, db, callback, fail, pass) {
    // Test 6 - Business Register pass //

  var message = {
    "email": "tniels@business.com",
    "password": "test",
    "firstname": "Torie",
    "lastname": "Oranges"
  };
  var response = 0;
  socket.emit('business register', message);

  socket.on('business register fail', function (err) {
    if (!response) {
      response = 1;
      fail(err, callback);
    }
  });

  socket.on('business register succeed', function() {
    if (!response) {
      response = 1;
      // check database for business info
      db.collection('businesses').findOne(message, function (err, doc) {
        if (err == null && doc != null) {
            pass('new business register', callback);
        } else {
            fail(err, callback);
        }
      });
    }
  });
}; 