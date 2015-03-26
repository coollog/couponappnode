// ALL CODE FOR WHEN A NEW CLIENT CONNECTS GOES IN THIS FILE

module.exports = function(server, socket) {
  socket.emit('html', '.content', server.view['register']());
}