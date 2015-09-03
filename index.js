var http = require('http')
var request = require('request')
var config = require('./config')

var srv = http.createServer(function (req, res) {
  res.end('OK')
})

srv.listen(8128, function () {
  console.log('server is listening on 8128')
})
