const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const contentDir = path.join(__dirname, 'content')

const buildRadar = () => {
  try {
    const radarJson = []
    const quadrantMappings = {
      techniques: 'Techniques',
      tools: 'Tools',
      platforms: 'Platforms',
      'languages-frameworks': 'languages-and-frameworks',
    }

    Object.entries(quadrantMappings).forEach(([dirName, quadrantName]) => {
      const quadrantDir = path.join(contentDir, dirName)

      if (!fs.existsSync(quadrantDir)) {
        console.warn(`Directory ${quadrantDir} does not exist, skipping...`)
        return
      }

      const files = fs.readdirSync(quadrantDir).filter((file) => file.endsWith('.html'))

      files.forEach((file) => {
        const filePath = path.join(quadrantDir, file)
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const frontmatterMatch = fileContent.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)

        if (!frontmatterMatch) {
          console.warn(`No frontmatter found in ${file}, skipping...`)
          return
        }

        const [, frontmatterYaml, htmlContent] = frontmatterMatch

        try {
          const metadata = yaml.load(frontmatterYaml)
          const blip = {
            name: metadata.name,
            ring: metadata.ring,
            quadrant: quadrantName,
            isNew: metadata.isNew,
            status: metadata.status,
            description: htmlContent.trim(),
          }

          radarJson.push(blip)
        } catch (yamlError) {
          console.error(`Error parsing YAML in ${file}:`, yamlError.message)
        }
      })
    })

    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist')
    }

    fs.writeFileSync('./dist/radar.json', JSON.stringify(radarJson).replace(/(\r\n|\n|\r|\s{2,})/gm, ''))

    console.log(`Radar JSON updated successfully with ${radarJson.length} blips.`)
  } catch (err) {
    console.error('Error building radar:', err)
  }
}

if (process.env.ENVIRONMENT === 'production') {
  buildRadar()
}

module.exports = { buildRadar }
