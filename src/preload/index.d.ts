import { ElectronAPI } from '@electron-toolkit/preload'
import { uploadResp } from '../main/ipcHandlers/fileIPC'
import { drive_v3 } from 'googleapis'
import { Event } from 'electron'

type callbackFunc = (event:Event,...args:any) => void

type api = {
  ipcHandle: ()=>void
  testIpc: ()=> Promise<any>
  authorizeUser: ()=>Promise<boolean>
  checkToken: ()=>Promise<boolean>
  getInfo: ()=>Promise<drive_v3.Schema$About | null>
  saveUser: ()=> Promise<void>
  disconnect: ()=> Promise<void>

  getList: (rootId:string)=>Promise<drive_v3.Schema$File[]>
  fileUpload: (filePath:string,rootId:string)=>Promise<uploadResp>
  deleteFile: (fileID:string)=>Promise<any>
  folderUpload: (folderPath:string,rootFolderId:string)=>Promise<uploadResp>
  downloadFile: (fileId:string,destPath:string)=>Promise<any>
  createRoot: ()=>Promise<boolean | null>
  getRoot: ()=>Promise<string | null>
  savePath: (Path:string)=>Promise<void>



  initWatcher: (watchPaths: string[],rootId:string,intervalTime:number)=>Promise<void>
  getFileHash: (filePath:string)=>Promise<string>
  stopWatching: ()=>Promise<void>
  onBackupStatus: (callback) => void
  
  showSaveDialog: (options: Electron.SaveDialogOptions)=>Promise<Electron.SaveDialogReturnValue>
  downloadAndOpenFile: (fileId:string,fileName:string)=>Promise<void>
  CreateTempFile: (fileName:string)=>Promise<string>
  OpenFileLocation: (filePath:string)=>Promise<void>
  showOpenDialog: (options: Electron.OpenDialogOptions)=>Promise<Electron.OpenDialogReturnValue>
  storeGet: (key:string)=>Promise<string | null>
  storeSet: (key:string,value:string)=>Promise<void>
  ImageToBase64: (filePath:string)=>Promise<string>
}

declare global {
  interface Window {
    api: api,
  }
}
