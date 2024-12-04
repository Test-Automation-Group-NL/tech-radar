const fs = require('node:fs')
const languagesFrameworks = require('./languages-frameworks').languagesFrameworks
const platforms = require('./platforms').platforms
const techniques = require('./techniques').techniques
const tools = require('./tools').tools

const buildRadar = () => {
  const radarJson = [...languagesFrameworks.content, ...platforms.content, ...techniques.content, ...tools.content]

  try {
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist')
    }

    fs.writeFileSync('./dist/radar.json', JSON.stringify(radarJson).replace(/(\r\n|\n|\r|\s{2,})/gm, ''))
    // file written successfully
  } catch (err) {
    console.error(err)
  }
}

module.exports = { buildRadar }
