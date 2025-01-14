import { contextBridge,ipcRenderer } from 'electron'


// Custom APIs for renderer

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', {
      ipcHandle: ()=> ipcRenderer.send('ping'),
      testIpc: ()=>ipcRenderer.invoke("test"),
      authorizeUser: ()=>ipcRenderer.invoke("authorize"),
      fileLIst: ()=> ipcRenderer.invoke("list"),
      FileUpload: ()=> ipcRenderer.invoke('upload')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}
