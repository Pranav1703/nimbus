import { ipcMain } from 'electron'
import { OAuth2Client } from 'google-auth-library'
import { authorize, loadSavedCredentialsIfExist } from '../auth'
import { drive_v3, google } from 'googleapis';
import { User } from '../models/user';
import { app } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios'

export let authClient:OAuth2Client;
export const registerUserIpcHandlers = ()=>{
    ipcMain.handle("authorize",async():Promise<boolean>=>{
        try {
            const client = await authorize() 
            if(client){
                authClient = client
            }

        } catch (error) {
            console.log(new Error(`Authorization failed. Error : ${error}`))
            return false
        }
        return true
    })
    ipcMain.handle("check-token",async():Promise<boolean>=>{
        try {
            const client = await loadSavedCredentialsIfExist()
            if(client){
                authClient = client
            }else{
                return false
            }
        } catch (error) {
            console.log(error)
            return false
        }
        return true
    })

    ipcMain.handle("user-info",async():Promise<drive_v3.Schema$About | null>=>{

        const drive = google.drive({
            version: 'v3',
            auth: authClient
        })

        try {
            const info = await drive.about.get({
                fields:'storageQuota,user,maxUploadSize' //storageQuota in Bytes
            })
            return info.data
        } catch (error) {
            console.log(error)
            return null
        }
    })
    ipcMain.handle("save-user",async(_event)=>{

        const drive = google.drive({
            version: 'v3',
            auth: authClient
        })

        try {
            const info = await drive.about.get({
                fields:'user' 
            })

            if(info.data.user){
                const result = await User.findOne({
                    email: info.data.user.emailAddress
                })
                
                if(result){
                    console.log("user already exists. User: ",result+"\n")
                    return 
                }else{
                    
                    const newUser = await User.create({
                        email: info.data.user.emailAddress,
                    })
                    
                    console.log("new user created. NewUser: ",newUser)
                }
            }else{
                console.error("info.data.user is undefined")
            }

        } catch (error) {
            console.log(error)
            return 
        }

    })

    ipcMain.handle("user-disconnect",async(_event)=>{
        const TOKEN_PATH = path.join(app.getPath("userData"),'token.json')
        console.log("token path: ",TOKEN_PATH)
        try {
            const tokenExists = await fs.access(TOKEN_PATH).then(() => true).catch(() => false);
    
            if (!tokenExists) {
                console.log('User is already logged out.');
                return;
            }
    
            const tokenData = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf8'));
            const refresh_token = tokenData.refresh_token;
    
            if (refresh_token) {
                await axios.post('https://oauth2.googleapis.com/revoke', null, {
                    params: { token: refresh_token },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                console.log('Token revoked successfully.');
            }
    
            await fs.unlink(TOKEN_PATH);
            console.log('Logged out successfully.');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    })
}
