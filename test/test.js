/* var assert = require("assert")
describe ('Array', function(){
    describe ('#indexOf', function(){
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(6));
        })
    })
})
*/

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var config = require('../config.js') //,
//  socket = require('socket.io-client')('http://localhost');
    // io = require('../node_modules/socket.io')(http) 
    // io = require('../server/socket.js')(config);
 // socket = io('http://localhost');

// -----------------------

var url = 'http://localhost:8080';
console.log('Connecting to ' + url);
var io = require('socket.io-client'),
    socket = io.connect(url, { reconnection: false }),
    async = require('async')
    MongoClient = require('mongodb').MongoClient;

function clearDB (callback) {
    MongoClient.connect(config.mongouri, function (err, db) {
        if (err != null) {
            console.dir(err);
            process.exit();
        }
            
        // server.db = db;
        var numColl = config.collections.length
        config.collections.forEach(function (collectionName) {
            if ()
            db.dropCollection(collectionName, function (err) {
                numColl--;
                if (err) {
                    console.log('dropping DB error: ', err)
                    /* if (typeof collectionName == String)
                        console.log(collectionName)
                    else 
                        console.log(typeof collectionName) */
                } else {
                    db.createCollection(collectionName);
                    console.log('created ', collectionName)
                }
                if (numColl == 0) {
                    console.log('mongodb cleared');
                    callback();
                }
            });
            
            // server.db[name] = db.collection(name);
        });
            
        
    });
}

socket.on('connect_error', function(error){ console.log('Error connecting to ' + url, error);});
socket.on('connect', function() {

    console.log('Connected to ' + url);


    // make this into for-loop
    var test1 = require('./test1.js')
    var test2 = require('./test2.js')
    var testArray = [test1, test2, test2]

    var testsCompleted = 0;

    function callback () {

        testsCompleted++;
        // console.log('At callback')
        if (testsCompleted < testArray.length)
            testArray[testsCompleted](socket, callback);
        else 
            console.log('All tests (' + testsCompleted + ') completed')
    }

    clearDB(function() {
        testArray[0](socket, callback);
    });
    

    // TRYING ASYNC HERE!!!
    /* async.eachSeries(testArray, function(currTest, callback) {
        currTest(socket, callback)
        //callback
    }, function (err) {
        if (err) {
            console.log('Test ' + testsCompleted + ' failed because: ', err)
            return this
        } else {
            testsCompleted++
            console.log(testsCompleted + ' test(s) completed')
            return this
       }
    }); */


    // Test 1 //
    /*
    var message = { "email": "jchirik@gmail.com", "password": "test", "firstname": "John", "lastname": "Apples" };
    socket.emit('customer register', message);
    socket.on('customer register fail', function(err) {
        console.log('Test 1 failed: ', err)
    })
    socket.on('customer register succeed', function() {
        console.log('Test 1 passed ..... new customer register')
    })
    */
    // End Test 1 //

     
    // Test 2 //

    /* var message = '{ "email": "jchirik@gmail.com", "password": "test", "firstname": "John", "lastname": "Apples" }';
    // var msg = JSON.parse(message)
    socket.emit('customer register', message);
    socket.on('customer register fail', function(err) {
        if (err == 'email already taken')
            console.log('Test 2 passed ..... attempted customer register (email already taken)')
        else 
            console.log('Test 2 failed: ', err)
    })
    socket.on('customer register succeed', function() {
        console.log('Test 2 failed: should not have succeeded')
    }) */

    // End Test 2 //

    // Test 3 //

   /* var message = '{ "email": "jchirik@gmail.com", "password": "test", "firstname": "John", "lastname": "Apples" }';
    // var msg = JSON.parse(message)
    socket.emit('customer register', message);
    socket.on('customer register fail', function(err) {
        console.log('Test 1 failed: ', err)
    })
    socket.on('customer register succeed', function() {
        console.log('Test 1 passed ..... new customer register')
    })
*/
    // End Test 1 //
    

});

// socket.on('connect', function)

// -----------------------
/*
socket.on('connect', function () {
    console.log('hi');
    socket.emit('my other event', { my: 'data' });
});
socket.on('connect_error', function (err){
    console.log('error happened. dunno why?')
    console.log(err)
    socket.emit('something went wrong')
});

console.log('reached here')
*/
// io.on('connection', function (socket) {
//   socket.on('ferret', function (name, fn) {
//     fn('woot');
//   });
// });

// var socket = io(); // TIP: io() with no args does auto-discovery
  // socket.on('connect', function () { // TIP: you can avoid listening on `connect` and listen on events directly too!
  //   socket.emit('ferret', 'tobi', function (data) {
  //     console.log(data); // data will be 'woot'
  //   });
  // });


