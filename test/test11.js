module.exports = function (socket, db, callback, fail, pass) {
  // Test 11 - Business Create Deal pass //

  var response = 0;
  var testhelpers = require('./testhelpers.js')(socket, db);

  // create after business registered and logged in
  testhelpers.businessLogin(function() {

    var dealdata = {
      title: 'French Fries + Veggie Burger',
      startPrice: '$15',
      endPrice: '$8',
      startTime: '15:00'
    }

    socket.emit('put deal', dealdata)
    // if putting deal is unsuccessful
    socket.on('put deal fail', function () {
      if (!response) {
        response = 1;
        fail('put deal failed', callback);
      }
    });

    // if putting deal is successful
    socket.on('put deal succeed', function () {
      if (!response) {
        response = 1;
        // check database
        db.collection('deals').findOne(dealdata, function (err, doc) {
          if (err == null && doc != null) {
            pass('business create deal', callback);
          } else {
            fail(err, callback);
          }
        });
      }
    });
  });
}