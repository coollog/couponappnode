module.exports = function (socket, db, callback, fail, pass) {
  // Test 18 - Customer Use Deal pass //
  // includes: business login, business add deal, customer login, customer claim deal, customer view claimed deals, use deal

  var response = 0, responseone = 0;
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

              // find claimed deal 
              db.collection('deals').findOne({startPrice: '$15'}, function(err, doc) {
                if (err)
                  fail(err, callback);
                else {

                  // use deal 
                  socket.emit('use deal', doc);

                  // listen for succeed
                  socket.on('use deal succeed', function() {
                    if (!responseone) {
                      responseone = 1;
                      // check that deal is marked used in database
                      db.collection('deals').findOne({_id: doc._id}, function(err, doc) {

                        if (err == null && doc != null) {
                          if (doc.used != null)
                            pass('customer use deal', callback);
                          else
                            fail('customer use deal failed', callback);
                        }
                        else 
                          fail(err, callback);
                      })
                    }
                  });
                  
                  // else fail
                  socket.on('use deal fail', function(err) {
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
  });
};