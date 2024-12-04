const fs = require('fs')

const modulePaths = ['./languages-frameworks', './platforms', './techniques', './tools']

const buildRadar = () => {
  try {
    const modules = modulePaths.map((modulePath) => {
      delete require.cache[require.resolve(modulePath)]
      return require(modulePath)
    })

    const radarJson = modules.flatMap((module) => module[Object.keys(module)[0]].content)

    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist')
    }

    fs.writeFileSync('./dist/radar.json', JSON.stringify(radarJson).replace(/(\r\n|\n|\r|\s{2,})/gm, ''))

    console.log('Radar JSON updated successfully.')
  } catch (err) {
    console.error('Error building radar:', err)
  }
}

module.exports = { buildRadar }
