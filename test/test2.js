module.exports = function (socket, callback) {
    // Test 2 //

    console.log('Starting test 2')
    var response = 0
    var message = { "email": "jchirik@hello.com", "password": "test", "firstname": "John", "lastname": "Apples" };
    // var msg = JSON.parse(message)
    socket.emit('customer register', message);
    socket.on('customer register fail', function(err) {
        if (!response) {
            response = 1
        	if (err == 'email already taken') {
        		console.log('Test 2 passed ..... attempted customer register (email already taken)')
                callback()
                return this
        	} else {
        		console.log('Test 2 failed: ', err)
                callback()
                return this
            }
        }
    })
    socket.on('customer register succeed', function() {
        if (!response) {
            response = 1
        	console.log('Test 2 failed: should not have succeeded')
            callback()
            return this
        }
    }) 
    // return this

    // End Test 2 //
}
