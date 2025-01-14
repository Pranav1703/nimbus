import { ipcMain } from "electron"
import { OAuth2Client } from 'google-auth-library';
import { authorize } from "../auth";

export let authClient:OAuth2Client;
export const registerUserIpcHandlers = ()=>{
    ipcMain.handle("authorize",async()=>{
        try {
            authClient = await authorize() as OAuth2Client

        } catch (error) {
            console.log(new Error(`Authorization failed. Error : ${error}`))
            return false
        }
        return true
    })
}