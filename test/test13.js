module.exports = function (socket, db, callback, fail, pass) {
  // Test 13 - Customer View Deals pass //
  // includes: business login, business add deal, customer login, customer view deals

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
              // check that one was added
              if (deals.length == 1)
                pass('customer view list of deals', callback);
              else
                fail('customer view list of deals wrong #', callback);
            }
          });

        })
    });
  // });
  });
};