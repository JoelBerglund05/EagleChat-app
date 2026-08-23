import { app, BrowserWindow, ipcMain } from 'electron'
import db from './database.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
            preload:  path.join(__dirname, 'preload.js')
    }
  })
  

  win.loadURL('http://localhost:5173')
}

ipcMain.handle('conversations:get', () => {
    return db.prepare(`
        SELECT *
        FROM conversations
        ORDER BY updated_at DESC
    `).all()
})

ipcMain.handle('conversations:getWithId', (event, id) => {
    return db.prepare(`
        SELECT *
        FROM conversations
        WHERE id = ?
    `).get(id)
})

ipcMain.handle('conversations:create', (event, title) => {
    const result = db.prepare(`
        INSERT INTO conversations (title)
        VALUES (?)
    `).run(title)

    return db.prepare(`
        SELECT *
        FROM conversations
        WHERE id = ?
    `).get(result.lastInsertRowid)
})

ipcMain.handle('conversations:insert', (event, title) => {
    return db.prepare(`
        INSERT INTO conversations (title)
        VALUES (?)
    `).run(title)
})

ipcMain.handle('messages:get', (event, conversationId) => {
    return db.prepare(`
        SELECT *
        FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC
    `).all(conversationId)
})

ipcMain.handle('messages:create', (event, conversationId, role, content) => {
    const result = db.prepare(`
        INSERT INTO messages (conversation_id, role, content)
        VALUES (?, ?, ?)
    `).run(conversationId, role, content)

    return db.prepare(`
        SELECT *
        FROM messages
        WHERE id = ?
    `).get(result.lastInsertRowid)
})

app.whenReady().then(() => {
  createWindow()
})