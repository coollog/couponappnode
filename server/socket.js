// SETUP FILE FOR SOCKETIO

module.exports = function (config) {
  var fs = require('fs'),
      util = require('./util'),
      MongoClient = require('mongodb').MongoClient,
      Process = require('./io/process'),
      Connect = require('./io/connect');

  function setup(callback) { // setup function, shouldn't need custom code
    function setupMongo() { // connect to mongo db
      MongoClient.connect(config.mongouri, function (err, db) {
        server.db = db;
        config.collections.forEach(function (name) {
          server.db[name] = db.collection(name);
        });
        
        console.log('mongodb connected');
        
        callback();
      });
    }

    setupMongo();
  }

  // initialization code - shouldn't need custom code

  var server = this;
  var io = require('socket.io')();
  this.sockets = io.sockets.connected;

  setup(function () {
    io.on('connection', function (socket) {
      Connect(server, socket); // when a client connects
      Process(server, socket); // all comm processing
    });

    io.listen(config.ioport);

    console.log('socketio listening on:' + config.ioport);
  });
}