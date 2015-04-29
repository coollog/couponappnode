module.exports = function (socket, db) {

  this.customerLogin = function (callback) {
    var message = {
    	"email": "jchirik@gmail.com",
    	"password": "test",
    	"firstname": "John",
    	"lastname": "Apples"
    };
    
    socket.emit('customer register', message);
    socket.on('customer register succeed', callback);
  };

  this.businessLogin = function (callback) {
    var message = {
      "email": "tniels@business.com",
      "password": "test",
      "firstname": "Torie",
      "lastname": "Oranges"
    };
    
    socket.emit('business register', message);
    socket.on('business register succeed', callback);
  };

  this.createDeal = function (callback) {
    var dealdata = {
      title: 'French Fries + Veggie Burger',
      startPrice: '$15',
      endPrice: '$8',
      startTime: '15:00',
      endTime: '17:00'
    }
    socket.emit('put deal', dealdata);
    socket.on('put deal succeed', callback);
  }

  return this;
}; 