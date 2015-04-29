module.exports = function (socket, db, callback) {
  // Test 5 - Customer Update pass //

  var response = 0;
  var message = {
    email: "jchirik@gmail.com",
    password: "test",
    lastname: "Apples"
  };
  socket.emit('customer register', message);

  // update after customer registered and logged in
  socket.on('customer register succeed', function() {
    socket.emit('customer login', message);

    // if login failed
    socket.on('customer login fail', function (err) {
      if (!response) {
        response = 1;
        fail(err, callback);
      }
    });

    // if login succeeded
    socket.on('customer login succeed', function() {
      if (!response) {
        var userdata = {
          email: 'jchirik@hotmail.com',
          password: 'testy',
          firstname: 'Joohn',
          lastname: 'data.lastname'
        };
        socket.emit('customer edit', userdata);

        // if edit is unsuccessful
        socket.on('customer edit fail', function (err) {
          if (!response) {
            response = 1;
            fail(err, callback);
          }
        });

        // if edit is successful
        socket.on('customer edit succeed', function () {
          if (!response) {
            response = 1;
            // check database
            db.collection('customers').findOne(userdata, function (err, doc) {
              if (err == null && doc != null) {
                // FIND KEYS AND DO THINGS TO CHECK THAT THEY ARE SAME AS THE MESSAGE!!!!
                //   not done with this test yet!!KOW)ER)($#(*))
                // ALSO FIND OUT WHAT MAKES DOC NULL?!?!?! (NO PASSWORD DOES FOR SURE)
                // console.log(doc)
                // doesn't seem to keep the claimed[], stripeid, etc !!!
                pass('existing customer update', callback);
              } else {
                // console.log(err + ' and doc: ' + doc)
                fail(err, callback);
              }
            });
          }
        });
        // check database
      }
    });
  });
}