import { ipcMain } from "electron"
import { drive_v3, google } from "googleapis";
import { authClient } from "./userIPC";
import * as fs from 'fs';
import path from 'path';
import mime from 'mime';
import { uploadFolder } from "../helper";
import { User } from "../models/user";
import { FileState } from "../models/state";

//https://developers.google.com/drive/api/reference/rest/v3/about#About

export type uploadResp = {
  id: string | null | undefined
}

export const registerFileIpcHandlers = ()=>{
    ipcMain.handle("list",async(_event,rootId):Promise<drive_v3.Schema$File[]>=>{
        try {
            const drive = google.drive({ version: 'v3', auth: authClient });
            const res = await drive.files.list({
              fields: 'nextPageToken, files(id, name)',
              q: `'${rootId}' in parents and trashed = false`
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
            return []
        }
    })

    ipcMain.handle("upload-file",async(_event,filePath:string,rootId:string):Promise<uploadResp>=>{
      
      const drive = google.drive({
        version: 'v3',
        auth: authClient
      })
      
      const fileName = path.basename(filePath)

      const requestBody = {
        name: fileName,
        fields: 'id',
        parents: [rootId]
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
          id: file.data.id
        }
      } catch (error) {
        console.log("error while trying to upload, Error:",error)
        return {
          id: null
        }
      }

    })

    ipcMain.handle("delete",async(_event,fileID)=>{
      const drive = google.drive({
        version: 'v3',
        auth: authClient
      })
      try {
        const resp = await drive.files.delete({
          fileId: fileID
        })
        console.log("deleted FilE: ", resp)
      } catch (error) {
        console.log("Couldn't delete the file. Err: ",error)
      }
    })

    ipcMain.handle("upload-folder",async(_event,folderPath:string,rootFolderId:string):Promise<uploadResp>=>{
      const drive = google.drive({
        version: 'v3',
        auth: authClient
      })

      try {
        const folderId = await uploadFolder(drive,folderPath,rootFolderId)
        return {
          id: folderId
        }
      } catch (error) {
        console.log("Error while uploading a folder: ",error)
        return {
          id: null
        }
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
            console.log(`Download completed. Total bytes read: ${bytesRead}B`);
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

    ipcMain.handle("create-root",async(_event):Promise<boolean | null>=>{
      const drive = google.drive({
        version: 'v3',
        auth: authClient
      })

      const res = await drive.files.list({
        fields: 'nextPageToken, files(id, name)',
        q: "mimeType = 'application/vnd.google-apps.folder' and name='nimbus'"
      });
      const files = res.data.files;
      if (!files || files.length === 0) {
        const folderMetadata = {
          name: "nimbus",
          mimeType: "application/vnd.google-apps.folder",
        };
      
        try {
          const folder = await drive.files.create({
            requestBody: folderMetadata,
            fields: "id",
          });
        
          console.log(`Created root folder, folder ID: ${folder.data.id}`)
          return true
        } catch (error) {
          console.log("couldn't create root folder: ",error)
          return null
        }
      }else{
        return false
      }


    })

    ipcMain.handle("get-root",async(_event):Promise<string | null>=>{
      const drive = google.drive({
        version: 'v3',
        auth: authClient
      })
      const res = await drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='nimbus' and trashed=false`,
        fields: 'files(id, name)',
      })
      if(res.data.files){
        console.log("search result: ", res.data.files)
        return res.data.files[0].id!        
      }else{
        return null
      }

    })

    ipcMain.handle("save-path",async(_event,email:string,filepath:string)=>{
      const user = await User.findOne({
        email:email
      })
      if(user){

        const fileState = await FileState.create({
          path:filepath
        })


        const updated = await User.updateOne(
          {
            email:email
          },
          {
            $push: {
              fileStates:fileState._id
            }
          }
        )
        console.log("added path: ",updated)
      }else{
        console.log("user not found")
      }
    })

    ipcMain.handle("save-state",async(_event,email:string,filePath:string,hash:string)=>{
      
      const user = await User.findOne({
        email:email
      })

      if(!user){
        console.log("user not found to update state")
        return
      }
      const fileState = await FileState.updateOne(
        {
          _id: {$in:user.fileStates},
          path:filePath
        },
        {
          $set:{
            hash:hash
          }
        }
      )
      console.log("updated fileState: ",fileState)
    })

    ipcMain.handle("update-file",async(_event,filePath:string,fileId:string)=>{
      const drive = google.drive({
        version: 'v3',
        auth: authClient
      })

      const fileName = path.basename(filePath);

      try {
          const response = await drive.files.update({
              fileId,
              media: {
                  mimeType: 'application/octet-stream',
                  body: fs.createReadStream(filePath),
              }
          });
          console.log(`File updated: ${fileName}`);
      } catch (error) {
          console.error(`Failed to update file: ${fileName}`, error);
      }
    })
}