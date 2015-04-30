module.exports = function (socket, db) {

  //var response = 0;
  this.customerLogin = function (callback) {
    var response = 0;
    var message = {
    	"email": "jchirik@gmail.com",
    	"password": "test",
    	"firstname": "John",
    	"lastname": "Apples"
    };
    
    socket.emit('customer register', message);
    socket.on('customer register succeed', function() {
      if (!response) {
        response = 1;
        callback();
      }
    });
  };

  this.businessLogin = function (callback) {
    var response = 0;
    var message = {
      "email": "tniels@business.com",
      "password": "test",
      "firstname": "Torie",
      "lastname": "Oranges"
    };
    
    socket.emit('business register', message);
    socket.on('business register succeed', function() {
      if (!response) {
        response = 1;
        callback();
      }
    });
  };

  this.createDeal = function (callback) {
    var response = 0;
    var count = 0;
    var dealdata = {
      title: 'French Fries + Veggie Burger',
      startPrice: '$15',
      endPrice: '$8',
      startTime: '15:00',
      endTime: '17:00'
    }
    if (count == 0) {
      count ++;
      socket.emit('put deal', dealdata);
    }
    socket.on('put deal succeed', function() {
      if (!response) {
        response = 1;
        callback();
      }
    });
  };

  this.claimDeal = function (callback) {
    var response = 0;
    db.collection('deals').findOne({startPrice: '$15'}, function(err, doc) {
      if (err) {
        console.log('claiming deal failed!');
        callback();
      }
      else {
        socket.emit('claim deal', doc);
        socket.on('claim deal succeed', function() {
          if (!response) {
            response = 1;
            callback();
          }
        })
      }
    });
  };

  return this;
}; 