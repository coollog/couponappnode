// ALL CODE FOR HANDLING SOCKETIO MESSAGES GOES IN THIS FILE
// (though can partition into multiple files)

module.exports = function(server, socket) {
  var util = require('../util');

  // Helper functions
  socket.login = function (type, userdata, _id, emit) {
    var data = {
      type: type,
      email: userdata.email,
      password: userdata.password
    }
    socket.user = data;
    if (typeof emit !== 'undefined') emit();
    console.log(type + ' login: ' + data.email + ' : ' + data.password);
  }

  // Customer side
    // CUSTOMER LOGIN
    socket.on('customer login', function (data) {
      data = util.formJSON(data);
      function fail() {
        socket.emit('customer login fail');
        console.log('login failed: ' + data.email + ' : ' + data.password);
      }
      function succeed(_id, firstname, lastname) {
        socket.login('customer', userdata, _id, function() {
          socket.emit('customer login succeed', _id, firstname, lastname);
        });
      }

      var userdata = {
        email: data.email,
        password: data.password
      };
      server.db['customers'].findOne(userdata, function (err, doc) {
        if (err == null && doc != null)
          succeed(doc._id, doc.firstname, doc.lastname);
        else fail();
      });
    });

    // CUSTOMER REGISTRATION
    socket.on('customer register', function (data) {
      data = util.formJSON(data);
      function fail(err) {
        socket.emit('customer register fail', err);
        console.log('existing registrant: ' + data.email + ' : ' + data.password);
      }
      function succeed(_id) {
        socket.emit('customer register succeed', _id);
        console.log('new registrant: ' + data.email + ' : ' + data.password);
        socket.login('customer', userdata, _id);
      }

      server.db['customers'].findOne({
        email: data.email
      }, function (err, doc) {
        if (err == null && doc == null) {
          var userdata = {
            email: data.email,
            password: data.password,
            firstname: data.firstname,
            lastname: data.lastname
          };
          server.db['customers'].insertOne(userdata, function(err, result) {
            if (err == null) succeed(result.ops[0]._id);
            else fail('could not make user');
          });
        } else fail('email already taken');
      });
    });

    // LIST OF DEALS
    socket.on('deals', function (data) {
      
    });

    // VIEW DEAL
    socket.on('deal', function (data) {
      
    });

    socket.on('search deals', function (data) {
      
    });

    socket.on('claim deal', function (data) {
      
    });

    socket.on('customer deals', function (data) {
      
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
          server.db['businesses'].insertOne(userdata, function(err, result) {
            if (err == null) succeed(result.ops[0]._id, userdata);
            else fail('could not make user');
          });
        } else fail('email already taken');
      });
    });

    // GET COMPANY PROFILE
    socket.on('get company', function (data) {
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
      
    });

    socket.on('business deals', function (data) {
      
    });

    socket.on('disconnect', function () {
      console.log('user disconnected: ' + socket.id);
    });
}

// module.exports = function(server, socket) {
//   socket.on('register', function (data) {
//     data = util.formJSON(data);

//     server.db['users'].insert({
//       email: data.email,
//       password: data.password
//     });

//     socket.emit('html', '.content', server.view['login']());

//     console.log('new registrant: ' + data.email + ' : ' + data.password);
//   });

//   socket.on('login', function (data) {
//     data = util.formJSON(data);
    
//     server.db['users'].findOne({
//       email: data.email,
//       password: data.password
//     }, function (err, doc) {
//       if (doc == null) {
//         socket.emit('flash', 'login failed');
//       } else {
//         var locals = {
//           email: data.email
//         }
//         socket.emit('html', '.content', server.view['main'](locals));

//         console.log('login by: ' + data.email);
//       }
//     });
//   });

//   socket.on('toLogin', function() {
//     socket.emit('html', '.content', server.view['login']());
//   });

//   socket.on('toRegister', function() {
//     socket.emit('html', '.content', server.view['register']());
//   });
// }