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
      checkToken: ()=>ipcRenderer.invoke("check-token"),
      getInfo: ()=>ipcRenderer.invoke("user-info"),
      saveUser: ()=>ipcRenderer.invoke("save-user"),
      disconnect: ()=>ipcRenderer.invoke("user-disconnect"),

      getList: (rootId:string)=> ipcRenderer.invoke("list",rootId),
      fileUpload: (filePath:string,rootId:string)=> ipcRenderer.invoke('upload-file',filePath,rootId),
      deleteFile: (fileID:string) => ipcRenderer.invoke('delete',fileID),
      folderUpload: (folderPath:string,rootFolderId:string)=>ipcRenderer.invoke('upload-folder',folderPath,rootFolderId),
      downloadFile: (fileId:string,destPath:string)=>ipcRenderer.invoke('download',fileId,destPath),
      createRoot: ()=> ipcRenderer.invoke("create-root"),
      getRoot: ()=>ipcRenderer.invoke("get-root"),
      savePath:(Path:string)=>ipcRenderer.invoke("save-path",Path),

      initWatcher: (watchPaths:string[],rootId:string,intervalTime:number)=>ipcRenderer.invoke("watch",watchPaths,rootId,intervalTime),
      getFileHash: (filePath:string)=>ipcRenderer.invoke("get-hash",filePath),
      stopWatching: ()=>ipcRenderer.invoke("stop-watching"),
      onBackupStatus: (callback) => ipcRenderer.on('backup-info', callback),


      showSaveDialog: (options) => ipcRenderer.invoke("show-save-dialog", options),
      CreateTempFile: (fileName:string) => ipcRenderer.invoke("create-temp-file", fileName),
      OpenFileLocation: (filePath:string) => ipcRenderer.invoke("open-file-location", filePath),
      showOpenDialog: (options) => ipcRenderer.invoke("show-open-dialog", options),
      storeGet: (key:string) => ipcRenderer.invoke("store-get", key),
      storeSet: (key:string, value:string) => ipcRenderer.invoke("store-set", key, value),
      ImageToBase64: (filePath:string) => ipcRenderer.invoke("convert-image-to-base64", filePath),
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}
