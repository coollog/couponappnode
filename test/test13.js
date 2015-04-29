module.exports = function (socket, db, callback, fail, pass) {
  // Test 13 - Customer Claim Deal pass //

  var response = 0;
  var testhelpers = require('./testhelpers.js')(socket, db);

  // register and login business, then create some deals
  testhelpers.businessLogin(function () {
    // add two deals
    //testhelpers.createDeal(function () {
      testhelpers.createDeal(function () {
        socket.emit('deals');
        socket.on('business deals', function() {
          
        });
      });
    // });
  });
}