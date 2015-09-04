var http = require('http')
var request = require('request')
var config = require('./config')
var handlebars = require('handlebars')

var srv = http.createServer(function (req, res) {
  var accept = req.headers.accept.split(',')
  console.log('accept header: ' + JSON.stringify(accept))
  // TODO: this needs to be smarter
  // what this does is get browsers to work when we have a text/html
  // content type defined.. maybe it's OK?
  accept = accept[0]
  if (!config.contentTypes.hasOwnProperty(accept)) {
    res.writeHead(406, {'Content-Type': 'application/json'})
    var r = {}
    r.message = 'Unsupported Accept header.'
    r.acceptable = Object.getOwnPropertyNames(config.contentTypes)
    res.end(JSON.stringify(r))
  } else {
    var template = handlebars.compile(config.contentTypes[accept])
    request(config.target.options, function (error, response, body) {
      if (error) {
        res.end('error! error!')
      } else {
        // TODO: should probably check statuscode.. fix this
        var result = template(JSON.parse(body))
        // console.log(result)
        res.setHeader('Content-Type', req.headers.accept)
        res.end(result)
      }
    })
  }
})

srv.listen(8128, function () {
  console.log('server is listening on 8128')
})
