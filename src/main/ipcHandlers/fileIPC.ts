import { ipcMain } from "electron"
import { google } from "googleapis";
import { authClient } from "./userIPC";
import * as fs from 'fs';
import path from 'path';
import mime from 'mime';

//https://developers.google.com/drive/api/reference/rest/v3/about#About

export const registerFileIpcHandlers = ()=>{
    ipcMain.handle("list",async(_event):Promise<Array<any> | void>=>{
        try {
            const drive = google.drive({ version: 'v3', auth: authClient });
            const res = await drive.files.list({
              fields: 'nextPageToken, files(id, name)',
            });
            const files = res.data.files;
            if (!files || files.length === 0) {
              console.log('No files found.');
              return [];
            }
          
            console.log('Files:');
            files.forEach((file) => {
              console.log(`${file.name} --- (${file.id})`);
            });

            return files

        } catch (error) {
            console.log(error)
        }
    })

    ipcMain.handle("upload",async(_event,filePath:string):Promise<{uploaded:boolean}>=>{
      
      const drive = google.drive({
        version: 'v3',
        auth: authClient
      })
      
      const fileName = path.basename(filePath)

      const requestBody = {
        name: fileName,
        fields: 'id',
      };

      const stream = fs.createReadStream(filePath)
      const mimeType = mime.getType(filePath) as string

      const media = {
        mimeType: mimeType,
        body: stream
      }
      
      try {
        const file = await drive.files.create({
          requestBody,
          media: media
        })
        console.log('File Id:', file.data.id);
        console.log("mime type: ",mimeType)
        console.log("bytes read :",stream.bytesRead)
        return {
          uploaded: true
        }
      } catch (error) {
        console.log("error while trying to upload, Error:",error)
        return {
          uploaded: false
        }
      }

    })

    ipcMain.handle("delete",async(_event,fileID)=>{
      const drive = google.drive({
        version: 'v3',
        auth: authClient
      })
      const resp = drive.files.delete({
        fileId: fileID
      })
    })
}