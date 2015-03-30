module.exports = function (config) {
  var app = require('express')(),
      http = require('http').Server(app);

  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

  http.listen(config.httpport, function () {
    console.log('http listening on:' + config.httpport);
  });
}