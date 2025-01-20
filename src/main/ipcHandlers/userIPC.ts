import { ipcMain } from 'electron'
import { OAuth2Client } from 'google-auth-library'
import { authorize, loadSavedCredentialsIfExist } from '../auth'

export let authClient: OAuth2Client
export const registerUserIpcHandlers = () => {
  ipcMain.handle('authorize', async (): Promise<boolean> => {
    try {
      const client = await authorize()
      if (client) {
        authClient = client
      }
    } catch (error) {
      console.log(new Error(`Authorization failed. Error : ${error}`))
      return false
    }
    return true
  })
  ipcMain.handle('checkToken', async (): Promise<boolean> => {
    try {
      const client = await loadSavedCredentialsIfExist()
      if (client) {
        authClient = client
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log(error)
      return false
    }
    return true
  })
}
