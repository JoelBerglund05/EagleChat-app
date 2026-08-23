const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('api', {
    conversations: {
        get: () => ipcRenderer.invoke('conversations:get'),
        getWithId: (id) => ipcRenderer.invoke('conversations:getWithId', id),
        create: (title) => ipcRenderer.invoke('conversations:create', title),
        insert: (title) => ipcRenderer.invoke('conversations:insert', title),
    },
    messages: {
        get: (conversationId) => ipcRenderer.invoke('messages:get', conversationId),
        create: (conversationId, role, content) => ipcRenderer.invoke('messages:create', conversationId, role, content),
    }
})