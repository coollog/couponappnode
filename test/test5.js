module.exports = function (socket, db, callback, fail, pass) {
  // Test 5 - Customer Update pass //

  var response = 0;
  var testhelpers = require('./testhelpers.js')(socket, db);

  // update after customer registered and logged in
  testhelpers.customerLogin(function() {

    if (!response) {

      var userdata = {
        email: 'jchirik@hotmail.com',
        firstname: 'Joohn',
        lastname: 'data.lastname'
      };
      socket.emit('customer edit', userdata);

      // if edit is unsuccessful
      socket.on('customer edit fail', function () {
        if (!response) {
          response = 1;
          fail('customer edit fail', callback);
        }
      });

      // if edit is successful
      socket.on('customer edit succeed', function () {
        if (!response) {
          response = 1;
          // check database
          db.collection('customers').findOne(userdata, function (err, doc) {
            if (err == null && doc != null) {
              if (doc.password == 'test')
                pass('existing customer update', callback)
              else
                fail('customer was not successfully updated', callback);
            } else {
              fail(err, callback);
            }
          });
        }
      });
    }
  });
}