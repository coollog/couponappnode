module.exports = function (socket, db, callback, fail, pass) {
  // Test 10 - Business Update pass //

  var response = 0;
  var testhelpers = require('./testhelpers.js')(socket, db);

  // update after business registered and logged in
  testhelpers.businessLogin(function() {

    if (!response) {

      var userdata = {
        email: 'tniels@hotmail.com',
        firstname: 'Toorie',
        lastname: 'data.lastname'
      };
      socket.emit('business edit', userdata);

      // if edit is unsuccessful
      socket.on('business edit fail', function (err) {
        if (!response) {
          response = 1;
          fail(err, callback);
        }
      });

      // if edit is successful
      socket.on('business edit succeed', function () {
        if (!response) {
          response = 1;
          // check database
          db.collection('businesses').findOne(userdata, function (err, doc) {
            if (err == null && doc != null) {
              if (doc.password == 'test')
                pass('existing business update', callback)
              else
                fail('business was not successfully updated', callback);
            } else {
              fail(err, callback);
            }
          });
        }
      });
        // check database
    }
  });
}