import { ipcMain, shell } from 'electron'
import { drive_v3, google } from 'googleapis'
import { authClient } from './userIPC'
import * as fs from 'fs'
import path from 'path'
import os from 'os'
import { downloadFile, downloadFolder, uploadFile, uploadFolder } from '../helper'
import { User } from '../models/user'
import { dialog } from 'electron/main'
import { mainWindow } from '..'
import Store from 'electron-store';
//https://developers.google.com/drive/api/reference/rest/v3/about#About


const store = new Store();

export type uploadResp = {
    id: string | null | undefined
}

export const registerFileIpcHandlers = ():void => {
    ipcMain.handle('list', async (_event, rootId): Promise<drive_v3.Schema$File[]> => {
        try {
            const drive = google.drive({ version: 'v3', auth: authClient })
            const res = await drive.files.list({
                fields: 'nextPageToken, files(id, name, size, modifiedByMeTime)',
                q: `'${rootId}' in parents and trashed = false`
            })
            const files = res.data.files
            if (!files || files.length === 0) {
                console.log('No files found.')
                return []
            }
            console.log('Files:')
            files.forEach((file) => {
                console.log(`${file.name} --- (${file.id})`)
            })

            return files
        } catch (error) {
            console.log(error)
            return []
        }
    })

    ipcMain.handle(
        'upload-file',
        async (_event, filePath: string, rootId: string): Promise<uploadResp> => {
            const drive = google.drive({
                version: 'v3',
                auth: authClient
            })
            try{
                
                const info = await drive.about.get({
                    fields:'user'
                })
    
                const user = await User.findOne({
                    email: info.data.user?.emailAddress
                })
                if (user) {
                    const updatedDoc = await User.findByIdAndUpdate(
                        user._id, 
                        { $addToSet: { rootpaths: filePath.trim() } },
                        { new: true } // Returns the updated document
                    )

                    console.log('Updated user:', updatedDoc);

                    const resp:uploadResp = await uploadFile(drive,filePath,rootId)
                    return resp   
                }else {
                    console.log('user not found, cannot add rootpath.')
                    return {
                        id: null
                    }
                }
            } catch (error) {
                console.log(error)
                return {
                    id: null
                }
            }

        }
    )

    ipcMain.handle('delete', async (_event, fileID) => {
        const drive = google.drive({
            version: 'v3',
            auth: authClient
        })
        try {
            const resp = await drive.files.delete({
                fileId: fileID
            })
            console.log('deleted FilE: ', resp)
        } catch (error) {
            console.log("Couldn't delete the file. Err: ", error)
        }
    })

    ipcMain.handle(
        'upload-folder',
        async (_event, folderPath: string, rootFolderId: string): Promise<uploadResp> => {
            const drive = google.drive({
                version: 'v3',
                auth: authClient
            })
         

            try {
                const info = await drive.about.get({
                    fields:'user'
                })
    
                const user = await User.findOne({
                    email: info.data.user?.emailAddress
                })

                console.log("folderPath (trimmed):", `"${folderPath.trim()}"`);
                console.log("Current rootpaths in DB:", user?.rootpaths);

                if (user) {
                    const updatedDoc = await User.findByIdAndUpdate(
                        user._id, 
                        { $addToSet: { rootpaths: folderPath.trim() } },
                        { new: true } // Returns the updated document
                    )

                    console.log('Updated user:', updatedDoc);
                } else {
                    console.log('user not found, cannot add rootpath.')
                    return {
                        id: null
                    }
                }

                const folderId = await uploadFolder(drive, folderPath, rootFolderId)
                return {
                    id: folderId
                }
            } catch (error) {
                console.log('Error while uploading a folder: ', error)
                return {
                    id: null
                }
            }
        }
    )

    // Handle data saving
    ipcMain.handle('store-set', (_event, key: string, value: string) => {
        store.set(key, value);
    });

    // Handle data retrieval
    ipcMain.handle('store-get', (_event, key: string) => {
        return store.get(key);
    });

    ipcMain.handle('show-save-dialog', async (_event, options) => {
        const result = await dialog.showSaveDialog(mainWindow, options)
        return result // Returns { filePath: "selected-path" } or { canceled: true }
    })

    ipcMain.handle('show-open-dialog', async (_event, options) => {
        const result = await dialog.showOpenDialog(mainWindow, {
            title: 'Select a File or Folder',
            ...options,
        });
    
        return result; // Returns { filePaths: ["selected-path"], canceled: true/false }
    });
    

    ipcMain.handle('download', async (_event, fileId: string, destPath: string) => {
        const drive = google.drive({
            version: 'v3',
            auth: authClient
        })
    
        try {
            // Step 1: Get file metadata to identify type
            const fileMetadata = await drive.files.get({
                fileId: fileId,
                fields: 'mimeType, name'
            })
    
            const mimeType = fileMetadata.data.mimeType
            const fileName = fileMetadata.data.name
            const isFolder = mimeType === 'application/vnd.google-apps.folder'
    
            if (isFolder) {
                console.log(`Downloading folder: ${fileName}`)
                await downloadFolder(drive, fileId, destPath)
            } else {
                console.log(`Downloading file: ${fileName}`)
                await downloadFile(drive, fileId, destPath)
            }
    
            console.log(`Download completed: ${destPath}`)
        } catch (error) {
            console.error('Error:', error)
        }
    })

    ipcMain.handle('create-temp-file', async (_event, fileName) => {
        try {
            // Create a temp directory inside system's temp folder
            const tempDir = path.join(os.tmpdir(), 'my-app-temp')
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true })
            }

            // Generate a unique temp file name
            const tempFilePath = path.join(tempDir, `${fileName}`)

            console.log('Temporary file created:', tempFilePath.toString())
            return tempFilePath.toString() 
        } catch (error) {
            console.error('Error creating temp file:', error)
            return error 
        }
    })

    ipcMain.handle('open-file-location', async (_event, filePath) => {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error('File does not exist')
            }

            // Open the folder and highlight the file in Explorer (Windows) / Finder (Mac)
            await shell.openPath(filePath)

            console.log('Opened file location:', filePath)
            return { success: true }
        } catch (error) {
            console.error('Error opening file location:', error)
            return { success: false, error }
        }
    })

    ipcMain.handle('create-root', async (_event): Promise<boolean | null> => {
        const drive = google.drive({
            version: 'v3',
            auth: authClient
        })

        const res = await drive.files.list({
            fields: 'nextPageToken, files(id, name)',
            q: "mimeType = 'application/vnd.google-apps.folder' and name='nimbus'"
        })
        const files = res.data.files
        if (!files || files.length === 0) {
            const folderMetadata = {
                name: 'nimbus',
                mimeType: 'application/vnd.google-apps.folder'
            }

            try {
                const folder = await drive.files.create({
                    requestBody: folderMetadata,
                    fields: 'id'
                })

                console.log(`Created root folder, folder ID: ${folder.data.id}`)
                return true
            } catch (error) {
                console.log("couldn't create root folder: ", error)
                return null
            }
        } else {
            return false
        }
    })

    ipcMain.handle('get-root', async (_event): Promise<string | null> => {
        const drive = google.drive({
            version: 'v3',
            auth: authClient
        })
        const res = await drive.files.list({
            q: `mimeType='application/vnd.google-apps.folder' and name='nimbus' and trashed=false`,
            fields: 'files(id, name)'
        })
        if (res.data.files) {
            console.log('search result: ', res.data.files)
            return res.data.files[0].id!
        } else {
            return null
        }
    })

    // ipcMain.handle('save-path', async (_event, path: string) => {
        
    //     const drive = google.drive({
    //         version: 'v3',
    //         auth: authClient
    //     })

    //     try {

            
    //     } catch (error) {
    //         console.log(error)
    //         return 
    //     }


    // })

    // ipcMain.handle('save-state', async (_event, email: string, filePath: string, hash: string) => {
    //     const user = await User.findOne({
    //         email: email
    //     })

    //     if (!user) {
    //         console.log('user not found to update state')
    //         return
    //     }
    //     const fileState = await FileState.updateOne(
    //         {
    //             _id: { $in: user.fileStates },
    //             path: filePath
    //         },
    //         {
    //             $set: {
    //                 hash: hash
    //             }
    //         }
    //     )
    //     console.log('updated fileState: ', fileState)
    // })

    // ipcMain.handle('update-file', async (_event, filePath: string, fileId: string) => {
    //     const drive = google.drive({
    //         version: 'v3',
    //         auth: authClient
    //     })

    //     const fileName = path.basename(filePath)

    //     try {
    //         const response = await drive.files.update({
    //             fileId,
    //             media: {
    //                 mimeType: 'application/octet-stream',
    //                 body: fs.createReadStream(filePath)
    //             }
    //         })
    //         console.log(`File updated: ${fileName}`)
    //     } catch (error) {
    //         console.error(`Failed to update file: ${fileName}`, error)
    //     }
    // })
    
    ipcMain.handle('convert-image-to-base64', async (_, filePath) => {
        try {
            const imageBuffer = fs.readFileSync(filePath);
            const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
            return base64Image;
        } catch (error) {
            console.error('Error converting image:', error);
            return null;
        }
    });
}
