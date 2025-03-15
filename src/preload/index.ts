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
      saveUser: (email:string,rootId:string)=>ipcRenderer.invoke("save-user",email,rootId),

      getList: (rootId:string)=> ipcRenderer.invoke("list",rootId),
      fileUpload: (filePath:string,rootId:string)=> ipcRenderer.invoke('upload-file',filePath,rootId),
      deleteFile: (fileID:string) => ipcRenderer.invoke('delete',fileID),
      folderUpload: (folderPath:string,rootFolderId:string)=>ipcRenderer.invoke('upload-folder',folderPath,rootFolderId),
      downloadFile: (fileId:string,destPath:string)=>ipcRenderer.invoke('download',fileId,destPath),
      createRoot: ()=> ipcRenderer.invoke("create-root"),
      getRoot: ()=>ipcRenderer.invoke("get-root"),
      savePath:(email:string,filepath:string)=>ipcRenderer.invoke("save-path",email,filepath),
      saveState: (email:string,filePath:string,hash:string)=>ipcRenderer.invoke("save-state",email,filePath,hash),
      updateFile:(filePath:string,fileId:string)=>ipcRenderer.invoke("update-file",filePath,fileId),

      initWatcher: (watchPaths:string[])=>ipcRenderer.invoke("watch",watchPaths),
      onFileChange: (callback) =>ipcRenderer.on("file-change",callback),
      cleanUpWatchers: ()=> ipcRenderer.invoke("cleanup-watchers"),
      getFileHash: (filePath:string)=>ipcRenderer.invoke("get-hash",filePath),
      checkState: (email:string)=>ipcRenderer.invoke("check-state",email)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}
