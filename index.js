var app = require('express')(),
    http = require('http').Server(app),
    server = require('./server');

var port = 8888;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

server(http);

http.listen(port, function () {
  console.log('listening on *:' + port);
});