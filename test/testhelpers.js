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

  return this;
}; 