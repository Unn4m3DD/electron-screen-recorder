"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
if (require('electron-squirrel-startup')) {
    electron_1.app.quit();
}
var createWindow = function () {
    // Create the browser window.
    var mainWindow = new electron_1.BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadFile(path.join(__dirname, '../src/index.html'));
};
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
//# sourceMappingURL=index.js.map