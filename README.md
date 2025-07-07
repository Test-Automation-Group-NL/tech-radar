# Tech Radar

> [!NOTE]
> You can find the live radar at [https://test-automation-group-nl.github.io/tech-radar/](https://test-automation-group-nl.github.io/tech-radar/)

An interactive technology radar for test automation tools, inspired by [thoughtworks.com/radar](http://thoughtworks.com/radar). This radar helps teams assess and adopt testing technologies across four quadrants: **Techniques**, **Tools**, **Platforms**, and **Languages & Frameworks**.

## How It Works

The tech radar consists of individual **blips** (technology assessments) organized into:

- **4 Quadrants**: Different categories of technology
- **4 Rings**: Maturity levels (Adopt, Trial, Assess, Hold)
- **Content Structure**: Each blip is stored as an HTML file with YAML frontmatter

The radar is built from individual HTML files in `radar/content/` and compiled into a single `radar.json` that powers the interactive visualization.

## Project Structure

```
radar/
├── content/                   # Individual blip content
│   ├── techniques/            # Testing techniques & methodologies
│   ├── tools/                 # Testing tools & utilities
│   ├── platforms/             # Testing platforms & services
│   └── languages-frameworks/  # Programming languages & frameworks
├── build.radar.json.js        # Build script (HTML → JSON)
├── radar.watch.js             # Development watcher
└── dist/
    └── radar.json             # Generated radar data
```

## Development Setup

### Prerequisites
- Node.js (v16+)
- npm

### Getting Started

1. **Clone the project**
   ```bash
   git clone <repository-url>
   cd tech-radar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run local:dev
   ```

   This will:
   - Build the radar from HTML files
   - Watch for changes in `radar/content/`
   - Start a local server at `http://localhost:8080`
   - Auto-reload on file changes

### Manual Build

To build the radar JSON-ile manually:

```bash
cd radar
node -e "const { buildRadar } = require('./build.radar.json.js'); buildRadar()"
```

## Adding a New Blip

### 1. Create the HTML File

Create a new `.html` file in the appropriate quadrant directory:

```
radar/content/[quadrant]/[blip-name].html
```

**Quadrant directories:**
- `techniques/` → Testing techniques & methodologies
- `tools/` → Testing tools & utilities
- `platforms/` → Testing platforms & services
- `languages-frameworks/` → Programming languages & frameworks

### 2. Use the Template

Each blip file uses YAML frontmatter + HTML content:

```html
---
name: "Your Technology Name"
ring: "Adopt|Trial|Assess|Hold"
isNew: "TRUE|FALSE"
status: "Moved In|Moved Out|No Change"
---

<h4>Description</h4>
<p>
  Brief description of the technology and its purpose.
</p>

<h4>Pros:</h4>
<ul>
  <li><strong>Advantage 1:</strong> Description of the benefit</li>
  <li><strong>Advantage 2:</strong> Another benefit</li>
</ul>

<h4>Cons:</h4>
<ul>
  <li><strong>Limitation 1:</strong> Description of the drawback</li>
  <li><strong>Limitation 2:</strong> Another limitation</li>
</ul>

<h4>Conclusion:</h4>
<p>
  Summary recommendation and guidance for teams.
</p>
```

### 3. Frontmatter Fields

| Field | Values | Description |
|-------|--------|-------------|
| `name` | String | Display name of the technology |
| `ring` | `Adopt`, `Trial`, `Assess`, `Hold` | Recommendation level |
| `isNew` | `TRUE`, `FALSE` | Whether this is a new addition |
| `status` | `Moved In`, `Moved Out`, `No Change` | Movement since last radar |

### 4. Content Guidelines

- **Keep it concise**: Aim for 2-3 paragraphs max
- **Be specific**: Include concrete examples and use cases
- **Stay current**: Reflect the current state of the technology
- **Be balanced**: Include both pros and cons
- **End with guidance**: Clear recommendation for teams

### 5. File Naming

Use kebab-case for filenames:
- "Page Object Model" → `page-object-model.html`
- "AI Assistants" → `ai-assistants.html`

## Publishing

The radar is automatically published via GitHub Actions when changes are merged to the main branch:

1. **Automatic Build**: GitHub Actions runs the build process
2. **Generate radar.json**: The build script processes all HTML files
3. **Deploy to GitHub Pages**: The compiled radar is published to the live URL

### Manual Publishing

For manual deployment:

1. Build the radar locally:
   ```bash
   npm run build
   ```

2. The generated files in `dist/` can be deployed to any static hosting service

## Development

### Hot Reload Development

When running `npm run local:dev`, the watcher will automatically rebuild the radar when you:
- Add new `.html` files
- Modify existing blip content
- Update frontmatter metadata

### Validation

The build script will warn you about:
- Missing frontmatter in HTML files
- Invalid YAML syntax
- Missing required fields

### File Organization

- Keep related blips in the correct quadrant directory
- Use descriptive filenames that match the technology name
- Maintain consistent formatting across all blips

## Contributing

1. Create a new branch for your changes
2. Add or modify blip files in `radar/content/`
3. Test locally with `npm run local:dev`
4. Submit a pull request with your changes

The radar will be automatically updated when your PR is merged!

