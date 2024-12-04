const fs = require('fs');
const path = require('path');

const sourceFile = path.resolve(__dirname, 'radar.json');
const destFolder = path.resolve(__dirname, 'dist');
const destFile = path.join(destFolder, 'radar.json');

if (!fs.existsSync(destFolder)) {
  fs.mkdirSync(destFolder, { recursive: true });
}

const copyFile = () => {
  fs.copyFile(sourceFile, destFile, (err) => {
    if (err) {
      console.error('Error copying file:', err);
    } else {
      console.log(`File copied to ${destFile}`);
    }
  });
};

copyFile();

fs.watch(sourceFile, (eventType) => {
  if (eventType === 'change') {
    console.log('Detected change in radar.json');
    copyFile();
  }
});

console.log('Watching for changes in radar.json...');
