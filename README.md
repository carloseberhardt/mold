# mold
modify json responses -- or a fungus

### Why?
Why not?
Sometimes you just want an easy way to apply a template to an API response. This is that.

### How?
Store your template(s), associate a base url with it, when you request through the proxy we apply the template, as identified via Accept header.

### Anything else?
Not sure.. what else could there be?

### Ok, more explanation.. through example
Given a service that returns some JSON data...

```
ApigeeCorporation in ~
☯ http api.lo5.at/surepark
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Cache-Control: private
Connection: keep-alive
Content-Length: 1139
Content-Type: application/json;charset=UTF-8
Date: Fri, 04 Sep 2015 19:40:44 GMT
Server: Microsoft-IIS/7.5
X-AspNet-Version: 4.0.30319
X-Powered-By: ASP.NET

{
    "parkinginfo": {
        "item": [
            {
                "capacity": 9109,
                "countAreaDate": "09/04/15 14:40:00",
                "countAreaId": 35,
                "countAreaName": "T1 General SurePark",
                "lot": "Terminal 1",
                "percentFull": 53,
                "percentRamp": 52.9553195752354,
                "spaces": 4206,
                "timeToFull": -1,
                "vehicles": 4903
            },
            {
                "capacity": 873,
                "countAreaDate": "09/04/15 14:40:00",
                "countAreaId": 36,
                "countAreaName": "T1 Short Term SurePark",
                "lot": "Terminal 1",
                "percentFull": 43,
                "percentRamp": 52.9553195752354,
                "spaces": 523,
                "timeToFull": -1,
                "vehicles": 383
            },
            {
                "capacity": 519,
                "countAreaDate": "09/04/15 14:40:00",
                "countAreaId": 116,
                "countAreaName": "Short Term SurePark",
                "lot": "Terminal 2",
                "percentFull": 66,
                "percentRamp": 38.3536654885418,
                "spaces": 174,
                "timeToFull": 10,
                "vehicles": 345
            },
            {
                "capacity": 8252,
                "countAreaDate": "09/04/15 14:40:00",
                "countAreaId": 127,
                "countAreaName": "Total MSP Value SurePark",
                "lot": "Terminal 2",
                "percentFull": 36,
                "percentRamp": 38.3536654885418,
                "spaces": 5233,
                "timeToFull": 5,
                "vehicles": 3019
            },
            {
                "capacity": 1302,
                "countAreaDate": "09/04/15 14:40:00",
                "countAreaId": 146,
                "countAreaName": "Quick Ride SurePark",
                "lot": "Terminal 2",
                "percentFull": 20,
                "percentRamp": 20.4301075268817,
                "spaces": 1036,
                "timeToFull": {},
                "vehicles": 266
            }
        ]
    }
}

ApigeeCorporation in ~
☯
```

We'd like to turn that into a simpler payload or perhaps some nice web thing. We create an API Proxy in Apigee Edge, and modify the config.js file to refer to our target server, and set the templates we want to use.

```
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
```
and ...
```
// config.contentTypes contains our templates
var htmlTemplate = fs.readFileSync('./surepark_template.html', {encoding: 'utf-8'})

config.contentTypes = {
  'text/html': htmlTemplate,
  'application/json': '{ "lots": [ {{#each parkinginfo.item}} { "terminal": "{{lot}}", "lot": "{{countAreaName}}", "percentFull": {{percentFull}} } {{#unless @last}},{{/unless}}  {{/each}} ]}'
}
```

Our templates are handlebars templates. You can add additional handlebars helpers right in config.js if needed.

Then when we hit our proxy, we can specify which template to apply via the accept header of our request:

```
ApigeeCorporation in ~
☯ http amer-demo6-prod.apigee.net/surepark accept:application/json
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 432
Content-Type: application/json
Date: Fri, 04 Sep 2015 19:33:30 GMT
Server: Apigee Router

{
    "lots": [
        {
            "lot": "T1 General SurePark",
            "percentFull": 54,
            "terminal": "Terminal 1"
        },
        {
            "lot": "T1 Short Term SurePark",
            "percentFull": 44,
            "terminal": "Terminal 1"
        },
        {
            "lot": "Short Term SurePark",
            "percentFull": 66,
            "terminal": "Terminal 2"
        },
        {
            "lot": "Total MSP Value SurePark",
            "percentFull": 36,
            "terminal": "Terminal 2"
        },
        {
            "lot": "Quick Ride SurePark",
            "percentFull": 20,
            "terminal": "Terminal 2"
        }
    ]
}
```

 or use a browser to hit http://amer-demo6-prod.apigee.net/surepark.
