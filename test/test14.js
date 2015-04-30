module.exports = function (socket, db, callback, fail, pass) {
  // Test 14 - Customer View Deal pass - multiple deals //

  var response = 0;
  var testhelpers = require('./testhelpers.js')(socket, db);

  // register and login business, then create some deals
  testhelpers.businessLogin(function () {
    // add one deal
    testhelpers.createDeal(function () {
        // add another deal
      testhelpers.createDeal(function () {
        // login as a customer
        testhelpers.customerLogin(function() {

          socket.emit('deals', {email: 'jchirik@gmail.com'});
          socket.on('deals', function(deals) {
            if (!response) {
              response = 1;
              // check that two were  added
              if (deals.length == 2)
                pass('customer view list of deals -- two deals', callback);
              else
                fail('customer view list of deals wrong #', callback);
            }
          });
          
        });
      });
    });
  // });
  });
};