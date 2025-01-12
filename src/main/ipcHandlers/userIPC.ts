import { ipcMain } from "electron"
import { OAuth2Client } from 'google-auth-library';
import { authorize } from "../auth";

export let client:OAuth2Client;
export const registerUserIpcHandlers = ()=>{
    ipcMain.handle("authorize",async()=>{
        try {
            client = await authorize() as OAuth2Client
            if(client===null){
                return false
            }
        } catch (error) {
            console.log(new Error(`Authorization failed. Error : ${error}`))
            return false
        }
        return true
    })
}