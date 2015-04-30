module.exports = function (socket, db, callback, fail, pass) {
  // Test 15 - Customer View Deal pass //
  // includes: business login, business add deal, customer login, customer view deals, customer view single deal

  var response = 0;
  var testhelpers = require('./testhelpers.js')(socket, db);

  // register and login business, then create some deals
  testhelpers.businessLogin(function () {
    // add one deal
    testhelpers.createDeal(function () {
      // login as a customer
      testhelpers.customerLogin(function() {

        // view all deals, then select one's _id
        socket.emit('deals', {email: 'jchirik@gmail.com'});

        socket.on('deals', function(deals) {
          if (!response) {
            response = 1;
            db.collection('deals').findOne({startPrice: '$15'}, function(err, doc) {
              if (err)
                fail(err, callback);
              else {
                
                // if succeed message
                socket.emit('deal', doc);
                var responseone = 0;
                socket.on('deal succeed', function(dealtwo) {
                  if (!responseone) {
                    responseone = 1;
                    
                    // check database to make sure deal is found
                    if (dealtwo != null)
                      pass('customer view deal', callback);
                    else
                      fail('customer view deal fail', callback);
                  }
                });

                // else fail
                socket.on('deal fail', function(err) {
                  if (!responseone) {
                    responseone = 1;
                    fail(err, callback);
                  }
                });
              }
            });
          }
        });
      });
    });
  });
};