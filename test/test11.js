module.exports = function (socket, db, callback, fail, pass) {
  // Test 9 - Business Update pass //

  var response = 0;
  var testhelpers = require('./testhelpers.js')(socket, db);

  // update after business registered and logged in
  testhelpers.businessLogin(function() {

    var dealdata = {
      title: 'French Fries + Veggie Burger',
      startPrice: '$15',
      endPrice: '$8',
      startTime: '15:00'
    }

    socket.emit('put deal', dealdata)
    // if edit is unsuccessful
    socket.on('put deal fail', function () {
      if (!response) {
        response = 1;
        fail('put deal failed', callback);
      }
    });

    // if edit is successful
    socket.on('put deal succeed', function () {
      if (!response) {
        response = 1;
        // check database
        db.collection('deals').findOne(dealdata, function (err, doc) {
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
  });
}