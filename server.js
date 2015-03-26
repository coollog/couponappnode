var util = require('./util'),
    jade = require('jade'),
    MongoClient = require('mongodb').MongoClient;

var mongouri = 'mongodb://admin:cpsc439@ds031571.mongolab.com:31571/couponapp';

module.exports = function(http) {
  function setup(callback) {

    server.htmlRegister = jade.compileFile(__dirname + '/views/register.jade');
    server.htmlLogin    = jade.compileFile(__dirname + '/views/login.jade');
    server.htmlMain     = jade.compileFile(__dirname + '/views/main.jade')

    MongoClient.connect(mongouri, function (err, db) {
      server.db = db;
      server.dbusers = db.collection('users');
      
      console.log('mongodb connected');
      
      callback();
    });
  }
  
  function connect(socket) {
    socket.emit('html', '.content', server.htmlRegister());
  }

  function process(socket) {
    socket.on('register', function (data) {
      data = util.formJSON(data);

      server.dbusers.insert({
        email: data.email,
        password: data.password
      });

      socket.emit('html', '.content', server.htmlLogin());

      console.log('new registrant: ' + data.email + ' : ' + data.password);
    });
    socket.on('login', function (data) {
      data = util.formJSON(data);
      
      server.dbusers.findOne({
        email: data.email,
        password: data.password
      }, function (err, doc) {
        if (doc == null) {
          socket.emit('flash', 'login failed');
        } else {
          var locals = {
            email: data.email
          }
          socket.emit('html', '.content', server.htmlMain(locals));

          console.log('login by: ' + data.email);
        }
      });
    });

    socket.on('toLogin', function() {
      socket.emit('html', '.content', server.htmlLogin());
    });
    socket.on('toRegister', function() {
      socket.emit('html', '.content', server.htmlRegister());
    });
  }

  var server = this;
  var io = require('socket.io')(http);
  var sockets = io.sockets.connected;

  setup(function () {
    io.on('connection', function (socket) {
      connect(socket);
      process(socket);
    });
  });
}