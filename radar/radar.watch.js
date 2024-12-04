const fs = require('fs')
const path = require('path')
const { buildRadar } = require('./build.radar.json.js')

const sourceFiles = [
  path.resolve(__dirname, 'languages-frameworks.js'),
  path.resolve(__dirname, 'platforms.js'),
  path.resolve(__dirname, 'techniques.js'),
  path.resolve(__dirname, 'tools.js'),
]

sourceFiles.forEach((sourceFile) => {
  fs.watch(sourceFile, (eventType) => {
    if (eventType === 'change') {
      console.log(`Detected change in "${sourceFile}"`)
      buildRadar()
    }
  })
})

console.log('Watching for changes in radar files...')
buildRadar()
