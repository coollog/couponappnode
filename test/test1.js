module.exports = function (socket, db, callback) {
	// Test 1 - Customer Register pass //

    var message = { "email": "jchirik@gmail.com", "password": "test", "firstname": "John", "lastname": "Apples" };
    var response = 0;
    socket.emit('customer register', message);

	    socket.on('customer register fail', function(err) {
	    	if (!response) {
	    		response = 1
		        console.log('Test 1 failed: ', err)
		        callback()
		        return this
		    }

	    })
	    socket.on('customer register succeed', function() {
	    	if (!response) {
		    	response = 1
		    	// check database for customer info
		    	db.collection('customers').findOne(message, function(err, doc) {
		    		if (err == null && doc != null) {
		    			console.log('Test 1 passed ..... new customer register')
		    			callback()
		    		} else {
		    			console.log('Test 1 failed: ', err)
		    			callback()
		    		}
		    	})
		        
	        	return this
	        }
	    })
	
   // End Test 1 //

}; 
