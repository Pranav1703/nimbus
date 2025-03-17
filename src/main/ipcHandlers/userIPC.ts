import { ipcMain } from 'electron'
import { OAuth2Client } from 'google-auth-library'
import { authorize, loadSavedCredentialsIfExist } from '../auth'
import { drive_v3, google } from 'googleapis';
import { User } from '../models/user';

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
            console.log(info.data)
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
}
