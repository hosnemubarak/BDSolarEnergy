/**
 * BD Solar Energy — Full-Stack Unified Development Server Launcher
 *
 * Runs both:
 * 1. Django REST Framework Backend (http://127.0.0.1:8001/api/v1/)
 * 2. Vite + React Frontend (http://localhost:5173/)
 *
 * Concurrently streams color-coded output and terminates cleanly on Ctrl+C.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');
const pythonExe = path.join(backendDir, 'venv', 'Scripts', 'python.exe');

// Check backend virtual environment
if (!fs.existsSync(pythonExe)) {
  console.error('\x1b[31m[ERROR]\x1b[0m Backend virtual environment not found at: ' + pythonExe);
  console.error('Please create it first:');
  console.error('  cd backend');
  console.error('  python -m venv venv');
  console.error('  .\\venv\\Scripts\\activate');
  console.error('  pip install -r requirements.txt');
  process.exit(1);
}

// Check frontend node_modules
const frontendNodeModules = path.join(frontendDir, 'node_modules');
if (!fs.existsSync(frontendNodeModules)) {
  console.error('\x1b[31m[ERROR]\x1b[0m Frontend node_modules not found.');
  console.error('Please run: cd frontend && npm install');
  process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', '=======================================================');
console.log('\x1b[32m%s\x1b[0m', '   BD Solar Energy — Full-Stack Launcher');
console.log('\x1b[32m%s\x1b[0m', '=======================================================');
console.log('Frontend Storefront:  \x1b[36mhttp://localhost:5173/\x1b[0m');
console.log('Backend REST API:     \x1b[36mhttp://127.0.0.1:8001/api/v1/\x1b[0m');
console.log('Django Admin:        \x1b[36mhttp://127.0.0.1:8001/admin/\x1b[0m');
console.log('API Swagger Docs:    \x1b[36mhttp://127.0.0.1:8001/api/docs/\x1b[0m');
console.log('-------------------------------------------------------');
console.log('Press \x1b[33mCtrl+C\x1b[0m at any time to shut down both servers.\n');

// 1. Launch Django Backend (.exe can be spawned directly)
const backend = spawn(pythonExe, ['manage.py', 'runserver', '127.0.0.1:8001'], {
  cwd: backendDir,
  stdio: ['inherit', 'pipe', 'pipe']
});

// 2. Launch Vite Frontend (batch/cmd files require shell: true on Windows)
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: frontendDir,
  shell: process.platform === 'win32',
  stdio: ['inherit', 'pipe', 'pipe']
});

function attachPrefix(stream, prefix, color) {
  if (!stream) return;
  let remaining = '';
  stream.on('data', (chunk) => {
    remaining += chunk.toString();
    const lines = remaining.split(/\r?\n/);
    remaining = lines.pop();
    for (const line of lines) {
      if (line.trim().length > 0) {
        console.log(`${color}${prefix}\x1b[0m ${line}`);
      }
    }
  });
}

attachPrefix(backend.stdout, '[BACKEND] ', '\x1b[36m');
attachPrefix(backend.stderr, '[BACKEND] ', '\x1b[36m');
attachPrefix(frontend.stdout, '[FRONTEND]', '\x1b[35m');
attachPrefix(frontend.stderr, '[FRONTEND]', '\x1b[35m');

let isTerminating = false;

function terminateServers() {
  if (isTerminating) return;
  isTerminating = true;
  console.log('\n\x1b[33m[SHUTDOWN]\x1b[0m Stopping BD Solar Energy servers...');

  if (process.platform === 'win32') {
    if (backend.pid) {
      spawn('taskkill', ['/pid', backend.pid.toString(), '/f', '/t'], { stdio: 'ignore' });
    }
    if (frontend.pid) {
      spawn('taskkill', ['/pid', frontend.pid.toString(), '/f', '/t'], { stdio: 'ignore' });
    }
  } else {
    if (backend.pid) backend.kill('SIGINT');
    if (frontend.pid) frontend.kill('SIGINT');
  }

  setTimeout(() => {
    console.log('\x1b[32m[DONE]\x1b[0m All servers stopped cleanly.');
    process.exit(0);
  }, 600);
}

process.on('SIGINT', terminateServers);
process.on('SIGTERM', terminateServers);

backend.on('close', (code) => {
  if (!isTerminating) {
    console.log(`\x1b[31m[BACKEND]\x1b[0m Process exited with code ${code}`);
  }
});

frontend.on('close', (code) => {
  if (!isTerminating) {
    console.log(`\x1b[31m[FRONTEND]\x1b[0m Process exited with code ${code}`);
  }
});
