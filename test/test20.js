module.exports = function (socket, db, callback, fail, pass) {
  // Test 20 - Business View Deals pass //
  // includes: business login, business add deal, business view deals

  var response = 0;
  var testhelpers = require('./testhelpers.js')(socket, db);

  // register and login business, then create some deals
  testhelpers.businessLogin(function () {
    // add one deal
    testhelpers.createDeal(function () {
      // attempt to view business deals
      socket.emit('business deals');
      socket.on('business deals', function(deals) {
        if (!response) {
          response = 1;
          // check that one deal is returned
          if (deals.length == 1)
            pass('business view list of deals', callback);
          else
            fail('business view list of deals wrong #', callback);
        }
      });

    });
  });
};