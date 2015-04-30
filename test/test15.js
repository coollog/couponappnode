module.exports = function (socket, db, callback, fail, pass) {
  // Test 16 - Customer Claim Deal pass //
  // includes: business login, business add deal, customer login, customer view deals, customer claim deal

  var response = 0;
  var testhelpers = require('./testhelpers.js')(socket, db);

  // register and login business
  testhelpers.businessLogin(function () {
    // add one deal
    testhelpers.createDeal(function () {
      // login as a customer
      testhelpers.customerLogin(function() {
        // view all deals, then select the one we added
          socket.emit('deals', {email: 'jchirik@gmail.com'});

          socket.on('deals', function(deals) {
            if (!response) {
              response = 1;
              db.collection('deals').findOne({startPrice: '$15'}, function(err, doc) {
                if (err)
                  fail(err, callback);
                else {
                  // attempt to claim deal
                  socket.emit('claim deal', doc);
                  var responseone = 0;

                  // if succeed message, check database
                  socket.on('claim deal succeed', function() {
                    if (!responseone) {
                      responseone = 1;

                      // check the deal to make sure it has been marked 'claimed'
                      db.collection('deals').findOne({_id: doc._id}, function(err, docone) {
                        if (err == null && doc != null) {
                          if (docone.claimed != null) {

                            // then check customer to make sure it has a new claimed deal in its array
                           db.collection('customers').findOne({email: 'jchirik@gmail.com'}, function(err, doctwo) {
                            if (doctwo.claimed != null)
                              pass('customer claim deal', callback);
                           });

                          }
                          else fail('customer claim deal fail', callback);
                        }
                        else fail('customer claim deal fail', callback);
                      });
                      
                    }
                  });

                  // else it fails
                  socket.on('claim deal fail', function(err) {
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