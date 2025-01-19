import { contextBridge,ipcRenderer } from 'electron'
import { uploadResp } from '../main/ipcHandlers/fileIPC'
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
      checkToken: ()=>ipcRenderer.invoke("checkToken"),

      getList: ()=> ipcRenderer.invoke("list"),
      fileUpload: (filePath:string)=> ipcRenderer.invoke('uploadFile',filePath),
      deleteFile: (fileID:string) => ipcRenderer.invoke('delete',fileID),
      folderUpload: (folderPath:string,parentFolderId?:string)=>ipcRenderer.invoke('uploadFolder',folderPath,parentFolderId),
      downloadFile: (fileId:string,destPath:string)=>ipcRenderer.invoke('download',fileId,destPath)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}
