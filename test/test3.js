module.exports = function (socket, db, callback) {
    // Test 3 - Customer Login pass //

    var response = 0
    var message = { "email": "jchirik@gmail.com", "password": "test" };
    socket.emit('customer register', message);

    // login after registered
    socket.on('customer register succeed', function() {
        socket.emit('customer login', message);
        socket.on('customer login fail', function(err) {
            if (!response) {
                response = 1
            	console.log('Test 3 failed: ', err)
                callback()
                return this
            }
        })
        socket.on('customer login succeed', function() {
            if (!response) {
                response = 1
                // check database for customer information
                db.collection('customers').findOne(message, function(err, doc) {
                    if (err == null && doc != null) {
                        console.log('Test 3 passed ..... existing customer login')
                        callback()
                    } else {
                        console.log('Test 3 failed: ', err)
                        callback()
                    }
                })
                return this
            }
        }) 
    })

    // End Test 3 //
}