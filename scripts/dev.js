const { execSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
// serve não usa ./public por padrão; serve a raiz e prioriza index.html
execSync('npx', ['serve', '-l', '5175'], { stdio: 'inherit', cwd: root });
