const electron = require('electron')
const url = require('url')
const path = require('path')

let {app, BrowserWindow, Menu} = electron

let mainWindow = null

app.on('ready', function () {
    mainWindow = new BrowserWindow(
        {
            width: 1100,
            height: 600,
            minWidth: 1100,
            minHeight: 600,
            center: true,
            icon: path.join(__dirname, 'assets/icons/png/256x256.png')
        })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src', 'views', 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    mainWindow.on('closed', function () {
        mainWindow = null
    })

    // const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    // Menu.setApplicationMenu(mainMenu)
})

const mainMenuTemplate = [
    {
        label: 'Jobs',
        submenu: [
            {
                label: 'Run Jobs',
                accelerator: process.platform == 'darwin' ? 'Command+R' : 'Ctrl+R',
                click() {
                    alert('hey')
                }
            },
            {
                label: 'Add New Job',
                accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
                click() {
                    alert('hey')
                }
            },
            {type:'separator'},
            {label: 'Clear Finished Jobs'},
            {label: 'Clear All Jobs'},
            {type:'separator'},
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit()
                }
            }
        ]
    },
    {label: 'Configuration'},
    {label: 'Help'}
]

if (process.platform == 'darwin')
{
    mainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production')
{
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Devtools',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {role: 'reload'}
        ]
    })
}
