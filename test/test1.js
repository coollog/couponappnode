module.exports = function (socket, callback) {

// var io = require('socket.io-client');
// var socket = io.connect(url, { reconnection: false });
// socket.on('connect_error', function(error){ console.log('Error connecting to ' + url, error);});
// socket.on('connect', function() {

// Test 1 //
	console.log('Starting test 1')
    var message = { "email": "jchirik@hi.com", "password": "test", "firstname": "John", "lastname": "Apples" };
    var response = 0;
    socket.emit('customer register', message);

    //if (!response)
	    socket.on('customer register fail', function(err) {
	    	if (!response) {
	    		response = 1
		        console.log('Test 1 failed: ', err)
		        callback()
		        return this
		    }
	        //console.log('past the callback...')

	    })
	    socket.on('customer register succeed', function() {
	    	if (!response) {
		    	response = 1
		        console.log('Test 1 passed ..... new customer register')
		        callback()
	        	return this
	        }
	    })
	
    //return this
}; 
// End Test 1 //