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
  saveUser: (email:string,rootId:string)=> Promise<void>

  getList: (rootId:string)=>Promise<drive_v3.Schema$File[]>
  fileUpload: (filePath:string,rootId:string)=>Promise<uploadResp>
  deleteFile: (fileID:string)=>Promise<any>
  folderUpload: (folderPath:string,rootFolderId:string)=>Promise<uploadResp>
  downloadFile: (fileId:string,destPath:string)=>Promise<any>
  createRoot: ()=>Promise<boolean | null>
  getRoot: ()=>Promise<string | null>
  savePath: (email:string,filepath:string)=>Promise<void>

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
