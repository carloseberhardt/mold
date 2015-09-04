var config = {}
// since this is js, we could use apigee-access here if we had a need
// and keep index.js very generic
// but static config is fine for a start

// config.target
config.target = {
  options: {
    method: 'GET',
    url: 'http://api.lo5.at/surepark',
    headers: {
      'User-Agent': 'mold request'
    }
  }
}

config.contentTypes = {
  'text/html': '<html><head></head><body><ul>{{#parkinginfo.item}}<li>{{countAreaName}} is {{percentFull}}% full</li>{{/parkinginfo.item}}</ul></body></html>',
  'application/json': '{{#each parkinginfo.item}}{{@key}}:{{this.capacity}}{{/each}}'
}

module.exports = config
