module.exports = function (socket, db, callback, fail, pass) {
  // Test 20 - Customer View Claimed Deals pass - multiple deals //
  // includes: business login, business add deal, customer login, customer claim deal, customer view claimed deals

  var response = 0;
  var testhelpers = require('./testhelpers.js')(socket, db);

  // register and login business, then create some deals
  testhelpers.businessLogin(function () {
    // add two deals
    testhelpers.createDeal(function () {
      testhelpers.createDeal(function() {
        // login as a customer
        testhelpers.customerLogin(function() {
          // claim both deals
          testhelpers.claimDeal(function() {
            testhelpers.claimDeal(function() {

              // view claimed deals
              socket.emit('customer deals', {email: 'jchirik@gmail.com'});

              socket.on('customer deals', function(deals) {
                if (!response) {
                  response = 1;
                  // check that two were added
                  if (deals.length == 2)
                    pass('customer view list of claimed deals (2)', callback);
                  else
                    fail('customer view list of claimed deals wrong #', callback);
                }
              });
            });

          });
        });
      });
    });
  });
};