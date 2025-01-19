import { ElectronAPI } from '@electron-toolkit/preload'
import { uploadResp } from '../main/ipcHandlers/fileIPC'

type api = {
  ipcHandle: ()=>void
  testIpc: ()=> Promise<any>
  authorizeUser: ()=>Promise<boolean>
  checkToken: ()=>Promise<boolean>

  getList: ()=>Promise<any>
  fileUpload: (filePath:string)=>Promise<uploadResp>
  deleteFile: (fileID:string)=>Promise<any>
  folderUpload: (folderPath:string,parentFolderId?:string)=>Promise<uploadResp>
  downloadFile: (fileId:string,destPath:string)=>Promise<any>

}
//add this type after finishing all the ipcHandlers.

declare global {
  interface Window {
    api: api,
  }
}
