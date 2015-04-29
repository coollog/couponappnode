module.exports = function (socket, db, callback, fail, pass) {
  // Test 9 - Business Update pass //

  var response = 0;
  var testhelpers = require('./testhelpers.js')(socket, db);

  // update after business registered and logged in
  testhelpers.businessLogin(function() {

    if (!response) {

      var userdata = {
        email: 'tniels@hotmail.com',
        password: 'testy',
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
              // FIND KEYS AND DO THINGS TO CHECK THAT THEY ARE SAME AS THE MESSAGE!!!!
              //   not done with this test yet!!KOW)ER)($#(*))
              // ALSO FIND OUT WHAT MAKES DOC NULL?!?!?! (NO PASSWORD DOES FOR SURE)
              // console.log(doc)
              // doesn't seem to keep the claimed[], stripeid, etc !!!
              pass('existing business update', callback);
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
}