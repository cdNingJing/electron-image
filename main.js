const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const Store = require('electron-store');
const fs = require('fs-extra');
const path = require('path');

const store = new Store();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    // 添加图标设置
    icon: path.join(__dirname, 'src', 'assets', 'images', 'app-icon.png')
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // 移除默认菜单
  Menu.setApplicationMenu(null);
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (!result.canceled) {
    store.set('lastFolder', result.filePaths[0]);
  }
  return result;
});

ipcMain.handle('get-files', async (event, folderPath) => {
  try {
    const files = await fs.readdir(folderPath);
    return files.map(file => ({
      name: file,
      isDirectory: fs.statSync(path.join(folderPath, file)).isDirectory()
    }));
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
});

ipcMain.handle('get-last-folder', () => {
  return store.get('lastFolder', '');
});
