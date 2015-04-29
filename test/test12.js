module.exports = function (socket, db, callback, fail, pass) {
  // Test 12 - Business View Deals pass //

  var response = 0;
  var testhelpers = require('./testhelpers.js')(socket, db);

  // register and login business, then create some deals
  testhelpers.businessLogin(function () {
    // add two deals
    testhelpers.createDeal(function () {
      testhelpers.createDeal(function () {
        socket.emit('business deals');
        socket.on('business deals', function(deals) {
          if (!response) {
            console.log(deals)
            if (deals.length == 2)
              pass('business view deals', callback);
            else
              fail('business view deals fails', callback);
          }
        });
      });
    });
  });
}