const fs = require('fs')
const path = require('path')
const https = require('https')

const currentConsoleVersion = require('./package.json').version

// --- Simple recursive file walker ---
function walk(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      walk(fullPath, callback)
    } else {
      callback(fullPath)
    }
  })
}

// --- Replace inline in files ---
function replaceStringInline(regex, replacement, paths) {
  paths.forEach(targetPath => {
    const resolvedPath = path.resolve(targetPath)

    if (!fs.existsSync(resolvedPath)) return

    const stat = fs.statSync(resolvedPath)

    if (stat.isDirectory()) {
      walk(resolvedPath, file => {
        replaceInFile(file, regex, replacement)
      })
    } else {
      replaceInFile(resolvedPath, regex, replacement)
    }
  })
}

function replaceInFile(file, regex, replacement) {
  const content = fs.readFileSync(file, 'utf8')
  const updated = content.replace(regex, replacement)

  if (content !== updated) {
    fs.writeFileSync(file, updated, 'utf8')
  }
}

// --- Fetch latest OpenHIM Core version ---
const options = {
  hostname: 'github.com',
  path: '/jembi/openhim-core-js/releases/latest',
  method: 'GET'
}

const req = https.request(options, res => {
  let data = ''
  res.setEncoding('utf8')

  res.on('data', chunk => {
    data += chunk
  })

  res.on('end', () => {
    try {
      const match = data.match(/releases\/tag\/v(\d+\.\d+\.\d+)/)
      if (!match) return

      const minimumCoreVersion = match[1]

      // Update config
      replaceStringInline(
        /"minimumCoreVersion":\s*"\d+\.\d+\.\d+"/,
        `"minimumCoreVersion": "${minimumCoreVersion}"`,
        ['./app/config/default.json']
      )

      // Update README badge
      replaceStringInline(
        /badge\/openhim--core-\d+\.\d+/,
        `badge/openhim--core-${minimumCoreVersion.slice(0, 3)}`,
        ['README.md']
      )

      // Update docs link
      replaceStringInline(
        /openhim\.readthedocs\.org\/en\/v\d+\.\d+\.\d+/,
        `openhim.readthedocs.org/en/v${minimumCoreVersion}`,
        ['README.md']
      )
    } catch (err) {
      console.error('Failed to process GitHub response:', err)
    }
  })
})

req.on('error', e => {
  console.log(`Problem fetching core version from GitHub: ${e.message}`)
})

req.end()

// --- Keep console version consistent ---
replaceStringInline(
  /"version":\s*"\d+\.\d+\.\d+"/,
  `"version": "${currentConsoleVersion}"`,
  [
    './app/config/default.json',
    './.travis/test.json',
    './.travis/staging.json'
  ]
)
