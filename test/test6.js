module.exports = function (socket, db, callback) {
    // Test 6 - Add card pass //

    var stripe = require('stripe')(config.stripekey);
    var response = 0
    var message = { email: "jchirik@gmail.com", password: "test", lastname: "Apples" };

    socket.emit('customer register', message);

    // update after customer registered and logged in
    socket.on('customer register succeed', function() {
        socket.on('customer register fail', function(err) {
            if (!response) {
                response = 1
                console.log('Test 6 failed: ', err)
                callback()
                return this
            }
        })

        // if register+login succeeded
        socket.on('customer register succeed', function() {
            if (!response) {
                var token = stripe.card.createToken({
                    number: 4242424242424242,
                    cvc: 123,
                    exp_month: 12,
                    exp_year: 18,
                }, )
                socket.emit('stripe token', )
                // if edit is unsuccessful
                socket.on('stripe token fail', function(err) {
                    if (!response) {
                        response = 1
                        console.log('Test 6 failed: ', err)
                        callback()
                        return this
                    }
                })
                // if edit is successful
                socket.on('stripe token succeed', function () {
                    if (!response) {
                        response = 1
                        // check database
                        db.collection('customers').findOne(message, function(err, doc) {
                            if (err == null && doc != null) {
                                // FIND KEYS AND DO THINGS TO CHECK THAT THEY ARE SAME AS THE MESSAGE!!!!
                                //   not done with this test yet!!KOW)ER)($#(*))
                                // ALSO FIND OUT WHAT MAKES DOC NULL?!?!?! (NO PASSWORD DOES FOR SURE)
                                console.log('Test 6 passed ..... existing customer update')
                                callback()
                            } else {
                                // console.log(err + ' and doc: ' + doc)
                                console.log('Test 6 failed: ', err)
                                callback()
                            }
                        }) 
                        return this
                    }
                })
                // check database
                /* */
                return this
            }
        }) 
    })

    // End Test 5 //
}