// ALL CODE FOR HANDLING SOCKETIO MESSAGES GOES IN THIS FILE
// (though can partition into multiple files)

module.exports = function(server, socket, stripe) {
  var util = require('../util');

  // Helper functions
  socket.login = function (type, userdata, emit) {
    var data = {
      type: type,
      _id: userdata._id,
      email: userdata.email,
      password: userdata.password,
      firstname: userdata.firstname,
      lastname: userdata.lastname,
      stripeid: userdata.stripeid
    }
    socket.user = data;
    if (typeof emit !== 'undefined') emit();
    console.log(type + ' login: ' + data.email + ' : ' + data.password);
  }
  socket.loggedIn = function (type) {
    return ('user' in socket && socket.user.type == type);
  }

  // Customer side
    // CUSTOMER LOGIN
    socket.on('customer login', function (data) {
      data = util.formJSON(data);
      function fail() {
        socket.emit('customer login fail');
        console.log('login failed: ' + data.email + ' : ' + data.password);
      }
      function succeed(doc) {
        socket.login('customer', doc, function() {
          socket.emit('customer login succeed', doc._id, doc.firstname, doc.lastname, doc.striperedacted);
        });
      }

      var userdata = {
        email: data.email,
        password: data.password
      };
      server.db['customers'].findOne(userdata, function (err, doc) {
        if (err == null && doc != null)
          succeed(doc);
        else fail();
      });
    });

    // CUSTOMER REGISTRATION
    socket.on('customer register', function (data) {
      data = util.formJSON(data);
      function fail(err, data) {
        socket.emit('customer register fail', err);
        if (typeof data !== 'undefined')
          console.log('existing registrant: ' + data.email + ' : ' + data.password);
        else
          console.log('registration fail: ' + err);
      }
      function succeed(_id, userdata) {
        socket.emit('customer register succeed', _id);
        console.log('new registrant: ' + data.email + ' : ' + data.password);
        socket.login('customer', userdata, _id);
      }

      server.db['customers'].findOne({
        email: data.email
      }, function (err, doc) {
        if (err == null) {
          if (doc == null) {
            var userdata = {
              email: data.email,
              password: data.password,
              firstname: data.firstname,
              lastname: data.lastname,
              claimed: [],
              stripeid: null,
              striperedacted: null
            };
            server.db['customers'].insertOne(userdata, function (err, res) {
              if (err == null) succeed(res.ops[0]._id, userdata);
              else fail('could not make user');
            });
          } else fail('email already taken', data);
        } else fail(err.message);
      });
    });

    // CUSTOMER EDIT PROFILE
    socket.on('customer edit', function (data) {
      if (!socket.loggedIn('customer')) return;

      data = util.formJSON(data);
      function fail() {
        socket.emit('customer edit fail');
        console.log('customer edit profile failed: ' + data.email);
      }
      function succeed() {
        socket.emit('customer edit succeed');
        console.log('customer edit profile succeeded: ' + data.email);
        // UPDATE socket.user IF NECESSARY
      }

      server.db['customers'].findOneAndUpdate({
        _id: socket.user._id
      }, data, function (err, r) {
        if (err == null && doc != null) succeed();
        else fail();
      });
    });

    // LIST OF DEALS
    socket.on('deals', function (data) {
      if (!socket.loggedIn('customer')) return;

      function succeed(deals) {
        socket.emit('deals', deals);
        console.log('deals: ' + socket.user.email);
      }

      server.db['deals'].find().toArray(function (err, docs) {
        if (err == null) succeed(docs);
        else fail();
      });
    });

    // VIEW DEAL
    socket.on('deal', function (data) {
      if (!socket.loggedIn('customer')) return;

      data = util.formJSON(data);
      function fail(err) {
        socket.emit('deal fail', err);
        console.log('retrieve deal failed: ' + socket.user.email + ' - ' + data._id);
      }
      function succeed(deal) {
        socket.emit('deal succeed', deal);
        console.log('retrieve deal succeeded: ' + socket.user.email + ' - ' + data._id);
      }
      
      server.db['deals'].findOne({
        _id: data._id
      }, function (err, doc) {
        if (err == null) succeed(doc);
        else fail('nonexistent deal');
      });
    });

    socket.on('search deals', function (data) {
      
    });

    socket.on('claim deal', function (data) {
      if (!socket.loggedIn('customer')) return;
      
      data = util.formJSON(data);
      function fail(err) {
        socket.emit('claim deal fail', err);
        console.log('claim deal failed: ' + socket.user.email + ' - ' + data._id);
      }
      function succeed() {
        socket.emit('claim deal succeed');
        console.log('claim deal succeeded: ' + socket.user.email + ' - ' + data._id);
      }

      server.db['deals'].find({
        _id: data._id
      }, function (err, doc) {
        if (err == null) {
          doc['claimed'] = socket.user._id;
          server.db['deals'].save(doc, function (err, res) {
            if (err == null) {
              // DO PAYMENT PROCESSING AND SHIT
              succeed();
            } else fail('cannot claim deal');
          });
        } else fail('nonexistent deal');
      });
    });

    socket.on('customer deals', function (data) {
      if (!socket.loggedIn('customer')) return;
      
      function succeed(deals) {
        socket.emit('customer deals', deals);
        console.log('retrieve customer deals: ' + socket.user.email);
      }

      server.db['deals'].find({
        claimed: socket.user._id
      }).toArray(function (err, docs) {
        if (err == null) succeed(docs);
        else fail();
      });
    });

    socket.on('stripe token', function (data) {
      if (!socket.loggedIn('customer')) return;

      data = util.formJSON(data);
      function fail(err) {
        socket.emit('stripe token fail', err);
        console.log('stripe token failed: ' + socket.user.email + ': ' + data.token + ' b/c ' + err);
      }
      function succeed(stripeid) {
        socket.emit('stripe token succeed', stripeid);
        console.log('stripe token succeeded: ' + socket.user.email + ': ' + stripeid);
      }

      function update(err, stripeid) {
        if (err) fail(err.message);
        else {
          server.db['customers'].findOneAndUpdate({
            _id: socket.user._id
          }, {
            $set: {
              stripeid: stripeid,
              striperedacted: data.redacted
            }
          }, function (err, doc) {
            if (err == null && doc != null) succeed(stripeid);
            else fail('could not update user');
          });
        }
      }
      if (socket.user.stripeid == null) {
        // create customer if not exist
        stripe.createCustomer(
          data.token, 
          socket.user.email, 
          [socket.user.firstname, socket.user.lastname].join(' '),
          update
        );
      } else {
        // update customer
        stripe.updateCustomer(
          socket.user.stripeid, -1, 'none', 'none',
          data.token, 
          update
        );
      }
    });

    socket.on('stripe charge', function (data) {
      if (!socket.loggedIn('customer')) return;

      data = util.formJSON(data);
      function fail(err) {
        socket.emit('stripe charge fail', err);
        console.log('stripe charge failed: ' + socket.user.email + ': $' + data.amount + ' for ' + data.description + ' b/c ' + err);
      }
      function succeed() {
        socket.emit('stripe charge succeed');
        console.log('stripe charge succeeded: ' + socket.user.email + ': $' + data.amount + ' for ' + data.description);
      }

      server.db['customers'].findOne({
        _id: socket.user._id
      }, function (err, doc) {
        if (err == null) {
          if (doc.stripeid != null) {
            stripe.chargeCustomer(
              socket.user.stripeid,
              data.amount,
              data.description,
              function (err) {
                if (err == null) succeed();
                else fail(err.message);
              }
            );
          } else fail('must create stripe id first');
        } else fail('customer error');
      });
    });


  // Business side
    // BUSINESS LOGIN
    socket.on('business login', function (data) {
      data = util.formJSON(data);
      function fail() {
        socket.emit('business login fail');
        console.log('login failed: ' + data.email + ' : ' + data.password);
      }
      function succeed(_id) {
        socket.login('business', userdata, _id, function() {
          socket.emit('business login succeed', _id);
        });
      }

      var userdata = {
        email: data.email,
        password: data.password
      };
      server.db['businesses'].findOne(userdata, function (err, doc) {
        if (err == null && doc != null)
          succeed(doc._id);
        else fail();
      });
    });

    // BUSINESS REGISTER
    socket.on('business register', function (data) {
      data = util.formJSON(data);
      function fail(err) {
        socket.emit('business register fail', err);
        console.log('existing registrant: ' + data.email + ' : ' + data.password);
      }
      function succeed(_id, userdata) {
        socket.emit('business register succeed', _id);
        console.log('new registrant: ' + data.email + ' : ' + data.password);
        socket.login('business', userdata, _id);
      }

      server.db['businesses'].findOne({
        email: data.email
      }, function (err, doc) {
        if (err == null && doc == null) {
          var userdata = {
            email: data.email,
            password: data.password,
            firstname: data.firstname,
            lastname: data.lastname,
            company: null,
            phone: data.phone
          };
          server.db['businesses'].insertOne(userdata, function (err, res) {
            if (err == null) succeed(res.ops[0]._id, userdata);
            else fail('could not make user');
          });
        } else fail('email already taken');
      });
    });

    // BUSINESS EDIT PROFILE
    socket.on('business edit', function (data) {
      data = util.formJSON(data);
      function fail() {
        socket.emit('business edit fail');
        console.log('business edit profile failed: ' + data.email);
      }
      function succeed() {
        socket.emit('business edit succeed');
        console.log('business edit profile succeeded: ' + data.email);
        // UPDATE socket.user IF NECESSARY
      }

      server.db['businesses'].findOneAndUpdate({
        _id: socket.user._id
      }, data, function (err, r) {
        if (err == null && doc != null) succeed();
        else fail();
      });
    });

    // GET COMPANY PROFILE
    socket.on('get company', function (data) {
      if (!socket.loggedIn('business')) return;

      function fail() {
        socket.emit('get company fail');
        console.log('get company profile fail: ' + socket.user.email);
      }
      function succeed(data) {
        socket.emit('get company succeed', data);
        console.log('get company profile succeed: ' + socket.user.email);
      }

      server.db['businesses'].findOne({
        email: data.email
      }, function (err, doc) {
        if (err == null && doc != null) succeed(doc.company);
        else fail();
      });
    });

    // MAKE OR EDIT COMPANY PROFILE
    socket.on('put company', function (data) {
      if (!socket.loggedIn('business')) return;

      data = util.formJSON(data);
      function fail(err) {
        socket.emit('put company fail', err);
        console.log('company profile fail: ' + socket.user.email);
      }
      function succeed() {
        socket.emit('put company succeed');
        console.log('company profile succeed: ' + socket.user.email);
      }

      server.db['businesses'].findOneAndUpdate({
        email: socket.user.email
      }, {$set: {
        company: {
          name: data.name,
          rating: data.rating,
          address: data.address,
          city: data.city,
          state: data.state,
          location: data.location,
          type: data.type
        }
      }}, function (err, r) {
        if (err == null) succeed();
        else fail('profile did not save');
      });
    });

    socket.on('put deal', function (data) {
      if (!socket.loggedIn('business')) return;

      data = util.formJSON(data);
      function fail() {
        socket.emit('put deal fail');
        console.log('deal fail: ' + socket.user.email);
      }
      function succeed(_id) {
        socket.emit('put deal succeed', _id);
        console.log('deal succeed: ' + socket.user.email + ' - ' + _id);
      }

      data['business'] = socket.user._id;
      if ('_id' in data) {
        server.db['deals'].findOneAndUpdate({
          _id: data._id
        }, data, function (err, r) {
          if (err == null) succeed(data._id);
          else fail();
        });
      } else {
        server.db['deals'].insertOne(data, function (err, res) {
          if (err == null) succeed(res.ops[0]._id);
          else fail();
        });
      }
    });

    socket.on('business deals', function (data) {
      if (!socket.loggedIn('business')) return;

      function succeed(deals) {
        socket.emit('business deals', deals);
        console.log('business deals: ' + socket.user.email);
      }

      server.db['deals'].find({
        _id: socket.user._id
      }).toArray(function (err, docs) {
        if (err == null) succeed(docs);
        else fail();
      });
    });

    socket.on('disconnect', function () {
      console.log('user disconnected: ' + socket.id);
    });
}