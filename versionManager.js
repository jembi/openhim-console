var currentConsoleVersion = require('./package.json').version
var https = require('https')
var replace = require("replace")

// Get latest version of core from Github
var options = {
  protocol: 'https:',
  hostname: 'github.com',
  path: '/jembi/openhim-core-js/releases/latest',
  method: 'GET'
}

var req = https.request(options, function(res) {
  var data = ''
  res.setEncoding('utf8')
  
  res.on('data', (chunk) => {
    data+=chunk
  })
  
  res.on('end', () => {
    var minimumCoreVersion = data.split("releases/tag/v")[1].substring(0, 5);
    // Add latest version of core to console config
    replace({
        regex: /\"minimumCoreVersion\"\:\ \"[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}\"/,
        replacement: `"minimumCoreVersion": "${minimumCoreVersion}"`,
        paths: ['./app/config/default.json'],
        recursive: true,
        silent: true,
    })
  })
})

req.on('error', (e) => {
  console.log(`Problem fetching core version from github: ${e.message}`)
})

req.end()

// Keep version of console consistent throughout project
replace({
    regex: /\"version\"\:\ \"[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}\"/,
    replacement: `"version": "${currentConsoleVersion}"`,
    paths: ['./bower.json', './app/config/default.json'],
    recursive: true,
    silent: true,
})