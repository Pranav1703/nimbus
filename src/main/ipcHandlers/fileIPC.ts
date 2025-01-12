import { ipcMain } from "electron"
import { google } from "googleapis";
import { client } from "./userIPC";


export const registerFileIpcHandlers = ()=>{
    ipcMain.handle("fileList",async(_event)=>{
        try {
            const drive = google.drive({ version: 'v3', auth: client });
            const res = await drive.files.list({
              pageSize: 10,
              fields: 'nextPageToken, files(id, name)',
            });
            const files = res.data.files;
            if (!files || files.length === 0) {
              console.log('No files found.');
              return;
            }
          
            console.log('Files:');
            files.forEach((file) => {
              console.log(`${file.name} (${file.id})`);
            });
        } catch (error) {
            console.log(error)
        }
    })
}