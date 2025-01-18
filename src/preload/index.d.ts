import { ElectronAPI } from '@electron-toolkit/preload'
type api = {
  ipcHandle: ()=>void
  testIpc: ()=> Promise<any>
  authorizeUser: ()=> ()=>Promise<any>
  getList: ()=>Promise<any>
  fileUpload: (filePath:string)=>Promise<any>
  deleteFile: (fileID:string)=>Promise<any>
  folderUpload: (folderPath:string,parentFolderId?:string)=>Promise<any>
  downloadFile: (fileId:string,destPath:string)=>Promise<any>

}
//add this type after finishing all the ipcHandlers.

declare global {
  interface Window {
    api: api,
  }
}
