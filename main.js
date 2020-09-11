const path = require('path')
const url = require('url')
const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const menuTemplate = require('./utils/menu');
const Log = require('./models/Log');
const connectDB = require('./config/db');
connectDB()


let mainWindow

let isDev = false

if (
	process.env.NODE_ENV !== undefined &&
	process.env.NODE_ENV === 'development'
) {
	isDev = true
}

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 800,
		show: false,
		icon: `${__dirname}/assets/icon.png`,
		webPreferences: {
			nodeIntegration: true,
		},
	})

	let indexPath

	if (isDev && process.argv.indexOf('--noDevServer') === -1) {
		indexPath = url.format({
			protocol: 'http:',
			host: 'localhost:8080',
			pathname: 'index.html',
			slashes: true,
		})
	} else {
		indexPath = url.format({
			protocol: 'file:',
			pathname: path.join(__dirname, 'dist', 'index.html'),
			slashes: true,
		})
	}

	mainWindow.loadURL(indexPath)

	// Don't show until we are ready and loaded
	mainWindow.once('ready-to-show', () => {
		mainWindow.show()

		// Open devtools if dev
		if (isDev) {
			const {
				default: installExtension,
				REACT_DEVELOPER_TOOLS,
			} = require('electron-devtools-installer')

			installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
				console.log('Error loading React DevTools: ', err)
			)
			mainWindow.webContents.openDevTools()
		}
	})

	mainWindow.on('closed', () => (mainWindow = null))
}
const clearAllLogs = () => {
	mainWindow.webContents.send('logs:clear');
}

app.on('ready', () => {
	createMainWindow()

	//set menu
	const clearLogs =   {
		label: 'ClearLogs',
		submenu: [
			{
				label: 'Clear All',
				click: clearAllLogs
			}
		]
	  }
	menuTemplate.push(clearLogs)
	const menu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(menu)
})
const sendLogs = async () => {
	try {
		const logs = await Log.find().sort({ created: -1 })
		mainWindow.webContents.send('logs:get', JSON.stringify(logs))
		// console.log(logs)
	} catch (error) {
		console.log(error)
	}
}
ipcMain.on('logs:load', sendLogs)
ipcMain.on('logs:add', async (e, item) => {
	try {
		await Log.create(item)
		const logs = await Log.find().sort({ created: -1 })
		sendLogs()
	} catch (error) {
		console.log(error)

	}
})
ipcMain.on('logs:delete', async (e, _id) => {
	try {
		await Log.deleteOne({ _id: _id });
		const logs = await Log.find().sort({ created: -1 })
		sendLogs()
	} catch (error) {
		console.log(error)
	}
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createMainWindow()
	}
})

// Stop error
app.allowRendererProcessReuse = true
