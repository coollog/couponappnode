module.exports = function (socket, db, callback, fail, pass) {
  // Test 13 - Customer View Deal pass //

  var response = 0;
  var testhelpers = require('./testhelpers.js')(socket, db);

  // register and login business, then create some deals
  testhelpers.businessLogin(function () {
    // add one deal
      testhelpers.createDeal(function () {
        // login as a customer
        testhelpers.customerLogin(function() {
          socket.emit('deals', {email: 'jchirik@gmail.com'});
          socket.on('deals', function(deals) {
            if (!response) {
              response = 1;
              // console.log(deals)
              //if (err)
              //  fail(err, callback);
              //else {
                db.collection('deals').findOne({startPrice: '$15'}, function(err, doc) {
                  if (err)
                    fail(err, callback);
                  else {
                    socket.emit('deal', {_id: doc._id});
                    var responseone = 0;
                    socket.on('deal succeed', function() {
                      if (!responseone) {
                        responseone = 1;
                        pass('customer view deal', callback);
                      }
                    });

                    socket.on('deal fail', function(err) {
                      if (!responseone) {
                        responseone = 1;
                        fail(err, callback);
                      }
                    });
                  }

                });
              //}
            }
          });
        })
    });
  // });
  });
};