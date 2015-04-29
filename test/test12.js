module.exports = function (socket, db, callback, fail, pass) {
  // Test 12 - Business View Deals pass //

  var response = 0;
  var testhelpers = require('./testhelpers.js')(socket, db);

  // register and login business, then create some deals
  testhelpers.businessLogin(function () {
    // add two deals
      testhelpers.createDeal(function () {
        socket.emit('business deals');
        socket.on('business deals', function() {
          if (!response) {
            response = 1;
            db.collection('deals').count(function(err, count) {
              if (err)
                fail('business view deals fails', callback);
              else
                console.log(count);
                if (count == 1)
                  pass('business view deals', callback);
                else 
                  fail('business view deals has wrong #', callback);
            })
              
          }
        });
      });
    // });
  });
}