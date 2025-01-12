import { ElectronAPI } from '@electron-toolkit/preload'
type api = {
  ipcHandle: ()=>void
  testIpc: ()=> void
  authorizeUser: ()=> void
  fileLIst: ()=> void
}
//add this type after finishing all the ipcHandlers.

declare global {
  interface Window {
    api: any,
  }
}
