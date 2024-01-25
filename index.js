const { app, BrowserWindow, dialog } = require('electron');
const { execSync } = require('child_process');
const os = require('os');

if (os.platform() === 'darwin') {
  try {
    execSync('npm install dmg-license@1.0.11', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error installing dmg-license:', error);
    process.exit(1);
  }
}


let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
    }
  });

  win.loadURL('https://ragabology.tq-box.com/login/');

  win.webContents.on('devtools-opened', () => {
    win.webContents.closeDevTools();
  });

  win.on('page-title-updated', (evt) => {
    evt.preventDefault();
  });

  setInterval(checkForRecordingSoftware, 30000);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

async function checkForRecordingSoftware() {
  try {
    const psList = (await import('ps-list')).default;
    const processes = await psList();
    const recordingSoftwares = [
        'screenrec', 'obs64', 'CamtasiaStudio', 'ScreenFlow', 'Bandicam', 'Snagit', 'Fraps',
        'QuickTimePlayer', 'XSplitBroadcaster', 'ScreencastOMatic', 'NVIDIAShare', 'RadeonSoftware',
        'MovaviScreenRecorder', 'DebutVideoCapture', 'Lightshot', 'Greenshot',
        'Windows Snipping Tool', 'ShotUI', 'ScreenClip', 'TinyTake', 'VLC Media Player', 
        'Screencastify', 'ActivePresenter', 'ShareX', 'Icecream Screen Recorder', 'Jing', 
        'Monosnap', 'Skitch', 'PicPick', 'Gyazo', 'Flameshot', 
        'DuckCapture', 'Snipping Tool++', 'Screenshot Captor', 'Ashampoo Snap', 'Snipaste', 
        'WinSnap', 'Shutter', 'Screenpresso', 'Clip2Net', 'Nimbus Screenshot', 
        'Lightscreen', 'FastStone Capture', 'ScreenHunter', 'Capto', 'CleanShot X', 
        'Droplr', 'CloudApp', 'Kapture', 'Screenie', 'SnapNDrag', 
        'CloudShot', 'ScreenTake', 'SnapCrab', 'Ksnip', 'Shotcut', 
        'Recordit', 'Loom', 'Screely', 'GoFullPage', 'Awesome Screenshot', 
        'Snip & Sketch', 'Screeny', 'Fireshot', 'Screenshot Guru', 'Webpage Screenshot', 
        'Snappy', 'SnapDraw', 'Screen Mimic', 'Snapz Pro X', 'TinyGrab', 
        'Screengrab!', 'Paparazzi!', 'LightScreen', 'Screenshot Pilot', 'Teampaper Snap', 
        'Snaggy', 'SnapShooter', 'Snippy', 'WinShot', 'HyperSnap', 
        'Grabilla', 'JShot', 'MWSnap', 'Screenr', 'Jing', 
        'CaptureWizPro', 'Sniptool', 'CrossHair', 'Screenshoter', 'Cropro', 
        'Purrint', 'SnapIt', 'Horizon33', 'Mr.Shot', 'HotShots', 
        '7capture', 'Jet Screenshot', 'SnapaShot', 
        // Add more here
        // ...
    ];

    
    const isRecordingSoftwareRunning = processes.some(process => 
      recordingSoftwares.includes(process.name)
    );

    if (isRecordingSoftwareRunning) {
      showDialog();
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function showDialog() {
  dialog.showMessageBox(win, {
    type: 'warning',
    title: 'Warning',
    message: 'Screen recording software detected! The app will close in 30 seconds.',
  }).then(() => {
    setTimeout(() => win.close(), 30000);
  });
}
