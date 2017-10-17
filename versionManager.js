var currentConsoleVersion = require('./package.json').version
var https = require('https')
var replace = require('replace')

// Get latest version of core from Github
var options = {
  protocol: 'https:',
  hostname: 'github.com',
  path: '/jembi/openhim-core-js/releases/latest',
  method: 'GET'
}

var replaceStringInline = function (inlineRegex, replacement, paths) {
  replace({
    regex: inlineRegex,
    replacement: replacement,
    paths: paths,
    recursive: true,
    silent: true
  })
}

var req = https.request(options, function (res) {
  var data = ''
  res.setEncoding('utf8')

  res.on('data', (chunk) => {
    data += chunk
  })

  res.on('end', () => {
    var minimumCoreVersion = data.split('releases/tag/v')[1].substring(0, 5)
    // Add latest version of core to console config
    replaceStringInline(/"minimumCoreVersion":"[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}"/, `"minimumCoreVersion": "${minimumCoreVersion}"`, ['./app/config/default.json'])
    // Edit readme with compatible version of core
    replaceStringInline(/badge\/openhim--core-[0-9]{1,2}\.[0-9]{1,2}/, `badge/openhim--core-${minimumCoreVersion.substr(0, 3)}`, ['README.md'])
    replaceStringInline(/openhim.readthedocs.org\/en\/v[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}/, `openhim.readthedocs.org/en/v${minimumCoreVersion}`, ['README.md'])
  })
})

req.on('error', (e) => {
  console.log(`Problem fetching core version from github: ${e.message}`)
})

req.end()

// Keep version of console consistent throughout project
replaceStringInline(/"version":"[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}"/, `"version": "${currentConsoleVersion}"`, ['./app/config/default.json'])
replaceStringInline(/"version":"[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}"/, `"version": "${currentConsoleVersion}"`, ['./.travis/test.json'])
replaceStringInline(/"version":"[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}"/, `"version": "${currentConsoleVersion}"`, ['./.travis/staging.json'])
