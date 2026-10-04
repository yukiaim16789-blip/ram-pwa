const { app, BrowserWindow, session } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8765;
let server = null;
let mainWindow = null;

function getRootDir() {
  // 開発時: プロジェクトフォルダ
  // パッケージ後: app.asar 内のアプリフォルダ
  return app.isPackaged ? app.getAppPath() : __dirname;
}

function getMime(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.htm': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm'
  };
  return types[ext] || 'application/octet-stream';
}

function safeResolve(root, urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }

  if (!decoded || decoded === '/') {
    decoded = '/www/index.html';
  }

  const relative = decoded.replace(/^\/+/, '').replace(/\//g, path.sep);
  const rootResolved = path.resolve(root);
  const fileResolved = path.resolve(root, relative);

  if (fileResolved !== rootResolved && !fileResolved.startsWith(rootResolved + path.sep)) {
    return null;
  }

  return fileResolved;
}

function startLocalServer() {
  return new Promise((resolve, reject) => {
    const root = getRootDir();

    server = http.createServer((req, res) => {
      const filePath = safeResolve(root, req.url.split('?')[0]);

      if (!filePath) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) {
          res.writeHead(404);
          res.end('Not Found');
          return;
        }

        res.writeHead(200, {
          'Content-Type': getMime(filePath),
          'Cache-Control': 'no-cache'
        });

        fs.createReadStream(filePath).pipe(res);
      });
    });

    server.once('error', reject);
    server.listen(PORT, '127.0.0.1', () => resolve());
  });
}

async function createWindow() {
  // YouTube埋め込みBGMをElectronでも再生しやすくする。
  app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 650,
    backgroundColor: '#0b0d19',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true
    }
  });

  // YouTube iframeの音声・メディア再生を許可。
  mainWindow.webContents.setAudioMuted(false);

  await mainWindow.loadURL(`http://127.0.0.1:${PORT}/www/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    await startLocalServer();
    await createWindow();
  } catch (error) {
    console.error('アプリ起動エラー:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (server) {
    server.close();
    server = null;
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (server) {
    server.close();
    server = null;
  }
});

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow();
  }
});
