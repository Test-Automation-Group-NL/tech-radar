const fs = require('fs')
const path = require('path')
const { buildRadar } = require('./build.radar.json.js')

const contentDir = path.resolve(__dirname, 'content')

const quadrantDirs = ['techniques', 'tools', 'platforms', 'languages-frameworks']

quadrantDirs.forEach((quadrantDir) => {
  const fullPath = path.join(contentDir, quadrantDir)

  if (fs.existsSync(fullPath)) {
    fs.watch(fullPath, { recursive: true }, (eventType, filename) => {
      if (eventType === 'change' && filename && filename.endsWith('.html')) {
        console.log(`Detected change in "${path.join(fullPath, filename)}"`)
        buildRadar()
      }
    })
    console.log(`Watching for changes in ${fullPath}`)
  } else {
    console.warn(`Directory ${fullPath} does not exist, skipping watch...`)
  }
})

console.log('Watching for changes in radar HTML files...')
buildRadar()
