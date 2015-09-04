var handlebars = require('handlebars')
var config = {}
var fs = require('fs')

// config.target is the request from which to retrieve the json
config.target = {
  options: {
    method: 'GET',
    url: 'http://api.lo5.at/surepark',
    headers: {
      'User-Agent': 'mold request'
    }
  }
}

// config.contentTypes contains our templates
var htmlTemplate = fs.readFileSync('./surepark_template.html', {encoding: 'utf-8'})

config.contentTypes = {
  'text/html': htmlTemplate,
  'application/json': '{ "lots": [ {{#each parkinginfo.item}} { "terminal": "{{lot}}", "lot": "{{countAreaName}}", "percentFull": {{percentFull}} } {{#unless @last}},{{/unless}}  {{/each}} ]}'
}

handlebars.registerHelper('ifvalue', function (conditional, options) {
  if (options.hash.value === conditional) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
})

module.exports = {config: config, handlebars: handlebars}
