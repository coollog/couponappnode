// SETUP FILE FOR SOCKETIO

module.exports = function (config) {
  var fs = require('fs'),
      util = require('./util'),
      jade = require('jade'),
      MongoClient = require('mongodb').MongoClient,
      Process = require('./io/process'),
      Connect = require('./io/connect');

  function setup(callback) { // setup function, shouldn't need custom code
    function compileViews() { // jade-compiles all the views for use
      server.view = {};

      fs.readdirSync(__dirname+'/views').forEach(function (name) {
        name = name.split('.');
        name.pop();
        name = name.join('.');
        server.view[name] = jade.compileFile(__dirname+'/views/'+name+'.jade');
      });
    }

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

    compileViews();
    setupMongo();
  }

  // initialization code - shouldn't need custom code

  var server = this;
  var io = require('socket.io')(config.ioport);
  var sockets = io.sockets.connected;

  setup(function () {
    io.on('connection', function (socket) {
      Connect(server, socket); // when a client connects
      Process(server, socket); // all comm processing
    });
  });
}