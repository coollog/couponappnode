var config = require('./config.js'),
    http   = require('./server/http')(config),
    socket = require('./server/socket')(config);