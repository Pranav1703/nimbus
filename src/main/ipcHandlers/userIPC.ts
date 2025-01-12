import { ipcMain } from "electron"
import { OAuth2Client } from 'google-auth-library';
import { authorize } from "../auth";

export let client:OAuth2Client;
export const registerUserIpcHandlers = ()=>{
    ipcMain.handle("authorize",async()=>{
        try {
            client = await authorize()
        } catch (error) {
            console.log(new Error(`Authorization failed. Error : ${error}`))
        }
    })
}