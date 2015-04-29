process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var config = require('../config.js');
config.mongouri = config.mongouritest;

var socketserver = require('../server/socket')(config);
var url = 'http://localhost:' + config.ioport;
console.log('Connecting to ' + url);

var io = require('socket.io-client'),
    socket = io.connect(url, { reconnection: false }),
    MongoClient = require('mongodb').MongoClient,
    colors = require('colors');

socket.on('connect_error', function(error) {
  console.log('Error connecting to ' + url, error);
});

socket.on('connect', function() {
  console.log('Connected to ' + url);

  // make this into for-loop
  var numTests = 5, testArray = [];
  for (var i = 1; i <= numTests; i ++) {
    testArray.push(require('./test' + i + '.js'));
  }

  var testsCompleted = 0, testsPassed;

  function fail(err, callback) {
    console.log('Test ' + testsCompleted + ' failed: '.red, err);
    callback();
  }
  function pass(msg, callback) {
    testsPassed ++;
    console.log('Test ' + testsCompleted + ' passed...... ', msg);
    callback();
  }

  function nextTest() {
    testsCompleted ++;
    
    if (testsCompleted <= testArray.length) {
      clearDB(function (db) {
        console.log('Starting test ' + testsCompleted);
        testArray[testsCompleted - 1](socket, db, callback);
      });
    }
    else {
      testsCompleted --;
      var msg = 'All tests completed, '+testsPassed+'/'+testsCompleted+' passed.';
      if (testsPassed == testsCompleted) console.log(msg.green);
      else console.log(msg.red);
    }
  }

  function clearDB (callback) {
    MongoClient.connect(config.mongouri, function (err, db) {
      if (err != null) {
        console.dir(err);
        process.exit();
      }
        
      db.collections(function (err, collNames) {
        if (err) console.log('collectionNames error: ', err);
        else {
          var numColl = collNames.length - 1;
          collNames.forEach(function (collection, index) {
            collection.drop()
            if (index == numColl) {
              console.log('mongodb cleared');
              callback(db);
            } 
          });
        }
      });
    });
  }

  nextTest();
});