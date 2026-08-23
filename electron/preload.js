const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('api', {
    conversations: {
        get: () => ipcRenderer.invoke('conversations:get'),
        create: (title) => ipcRenderer.invoke('conversations:create', title),
        insert: (title) => ipcRenderer.invoke('conversations:insert', title),
    },
    messages: {
        get: (conversationId) => ipcRenderer.invoke('messages:get', conversationId),
        create: (conversationId, role, content) => ipcRenderer.invoke('messages:create', conversationId, role, content),
    }
})