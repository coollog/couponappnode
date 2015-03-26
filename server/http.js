var app = require('express')(),
    http = require('http').Server(app);

var port = 8888;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});