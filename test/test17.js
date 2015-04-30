module.exports = function (socket, db, callback, fail, pass) {
  // Test 17 - Customer View Claimed Deals pass //
  // includes: business login, business add deal, customer login, customer claim deal, customer view claimed deals

  var response = 0;
  var testhelpers = require('./testhelpers.js')(socket, db);

  // register and login business, then create some deals
  testhelpers.businessLogin(function () {
    // add one deal
      testhelpers.createDeal(function () {
        // login as a customer
        testhelpers.customerLogin(function() {
          // claim deal 
          testhelpers.claimDeal(function() {
            // view claimed deals
            socket.emit('customer deals', {email: 'jchirik@gmail.com'});

            socket.on('customer deals', function(deals) {
              if (!response) {
                response = 1;
                // check that one was added
                if (deals.length == 1)
                  pass('customer view list of claimed deals', callback);
                else
                  fail('customer view list of claimed deals wrong #', callback);
              }
            });
          });
        })
    });
  });
};