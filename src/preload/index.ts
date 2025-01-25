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

      getList: ()=> ipcRenderer.invoke("list"),
      fileUpload: (filePath:string)=> ipcRenderer.invoke('upload-file',filePath),
      deleteFile: (fileID:string) => ipcRenderer.invoke('delete',fileID),
      folderUpload: (folderPath:string,parentFolderId?:string)=>ipcRenderer.invoke('upload-folder',folderPath,parentFolderId),
      downloadFile: (fileId:string,destPath:string)=>ipcRenderer.invoke('download',fileId,destPath),
      createRoot: ()=> ipcRenderer.invoke("create-root"),
      getRoot: ()=>ipcRenderer.invoke("get-root"),

      initWatcher: (watchPaths:string[])=>ipcRenderer.invoke("watch",watchPaths),
      onFileChange: (callback) =>ipcRenderer.on("file-change",callback),
      cleanUpWatchers: ()=> ipcRenderer.invoke("cleanup-watchers"),
      getFileHash: (filePath:string)=>ipcRenderer.invoke("get-hash",filePath)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}
