import { ipcMain } from "electron"
import { google } from "googleapis";
import { authClient } from "./userIPC";
import * as fs from 'fs';
import path from 'path';
import mime from 'mime';
import { uploadFolder } from "./helper";

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

    ipcMain.handle("uploadFile",async(_event,filePath:string):Promise<{uploaded:boolean}>=>{
      
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
        console.log("----------------------------------")
        console.log('File Id:', file.data.id);
        console.log("mime type: ",mimeType)
        console.log("bytes read :",stream.bytesRead)
        console.log("----------------------------------")
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
      const resp = await drive.files.delete({
        fileId: fileID
      })
      console.log("deleted FilE: ", resp)
    })

    ipcMain.handle("uploadFolder",async(_event,folderPath:string,parentFolderId?:string)=>{
      const drive = google.drive({
        version: 'v3',
        auth: authClient
      })

      try {
        await uploadFolder(drive,folderPath,parentFolderId)
      } catch (error) {
        console.log("Error while uploading a folder: ",error)
      }
  
    })

    ipcMain.handle("download",async(_event,fileId:string,destPath:string)=>{
      const drive = google.drive({
        version: 'v3',
        auth: authClient
      })
      try {
        const file = await drive.files.get({
          fileId: fileId,
          alt: 'media',
          acknowledgeAbuse: true,
        },{responseType:'stream'})
        console.log("file status: ",file.statusText)

        const directory = path.dirname(destPath);
        if (!fs.existsSync(directory)) {
          fs.mkdirSync(directory, { recursive: true });
        }

        const destStream = fs.createWriteStream(destPath)

        let bytesRead:number = 0;

        await new Promise<void>((resolve,reject)=>{
          file.data
          .on("data", (chunk) => {
            bytesRead += chunk.length;
          })
          .on("end", () => {
            console.log(`Download completed. Total bytes read: ${bytesRead}`);
          })
          .on("error", (err) => {
            console.error("Error during file download:", err);
            reject(err);
          })
          .pipe(destStream)
          .on("finish", () => {
            console.log("File successfully saved to:", destPath);
            resolve();
          })
          .on("error", (err) => {
            console.error("Error writing file:", err);
            reject(err);
          });
          
        })

      } catch (error) {
        console.log(error)
      }
    })
}