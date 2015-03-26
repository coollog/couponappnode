var fs = require('fs');

module.exports = {
  readFile: function (fname) {
    return fs.readFileSync(__dirname + '/views/register.html', 'utf8');
  },

  formJSON: function (serial) {
    var json = {};

    for (var i = 0; i < serial.length; i ++)
      json[serial[i].name] = serial[i].value;

    return json;
  }
}