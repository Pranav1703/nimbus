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

  getList: ()=>Promise<any>
  fileUpload: (filePath:string)=>Promise<uploadResp>
  deleteFile: (fileID:string)=>Promise<any>
  folderUpload: (folderPath:string,parentFolderId?:string)=>Promise<uploadResp>
  downloadFile: (fileId:string,destPath:string)=>Promise<any>
  createRoot: ()=>Promise<void>
  getRoot: ()=>Promise<void>

  initWatcher: (watchPaths: string[])=>Promise<void>
  onFileChange: (callback: callbackFunc)=> void
  cleanUpWatchers: ()=>void
  getFileHash: (filePath:string)=>Promise<string>
}

declare global {
  interface Window {
    api: api,
  }
}
