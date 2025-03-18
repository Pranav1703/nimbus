import * as fs from 'fs';
import path from 'path';
import mime from 'mime';
import crypto from 'crypto';
import { activeWatchers } from './ipcHandlers/watcherIPC';
import { uploadResp } from './ipcHandlers/fileIPC';
import { authClient } from './ipcHandlers/userIPC';
import { drive_v3, google } from 'googleapis';
import { User } from './models/user';

export async function uploadFile(drive: drive_v3.Drive, filePath:string,rootId:string):Promise<uploadResp> {
    const fileName = path.basename(filePath)

      // Check if file already exists
      const existingFile = await drive.files.list({
        q: `'${rootId}' in parents and name='${fileName}' and trashed=false`,
        fields: 'files(id)',
    });

    const files = existingFile.data.files || []; // Ensure it's always an array
    const fileId = files.length > 0 ? files[0].id : null;


    const requestBody = {
        name: fileName,
        parents: [rootId]
    }   

    const stream = fs.createReadStream(filePath)
    const mimeType = mime.getType(filePath) as string   
    const media = {
        mimeType: mimeType,
        body: stream
    } 

    try {
        let file;

        if (fileId) {
            // Update existing file
            file = await drive.files.update({
                fileId,
                media: media
            });
            console.log(`Updated existing file: ${fileName} (ID: ${fileId})`);
        } else {
            // Create new file
            file = await drive.files.create({
                requestBody,
                media: media,
                fields: 'id',
            });
            console.log(`Uploaded new file: ${fileName} (ID: ${file.data.id})`);
        }
        
        console.log('----------------------------------')
        console.log('File Id:', file.data.id)
        console.log('mime type: ', mimeType)
        console.log('bytes read :', stream.bytesRead)
        console.log('----------------------------------')
        return {
            id: file.data.id
        }
    } catch (error) {
        console.log('error while trying to upload, Error:', error)
        return {
            id: null
        }
    }
}

export async function uploadFolder(drive, folderPath:string, parentFolderId?:string):Promise<any> {
    const folderName = path.basename(folderPath);
  

    let folderId;  // Declare folderId outside to ensure proper scoping

    // Check if folder already exists
    const existingFolder = await drive.files.list({
        q: `'${parentFolderId}' in parents and name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id)'
    });

    if (existingFolder.data.files && existingFolder.data.files.length > 0) {
        folderId = existingFolder.data.files[0].id;
        console.log(`Folder already exists: ${folderName}, ID: ${folderId}`);
    } else {
        // Create the folder if it doesn't exist
        const folder = await drive.files.create({
            requestBody: {
                name: folderName,
                mimeType: "application/vnd.google-apps.folder",
                parents: parentFolderId ? [parentFolderId] : [],
            },
            fields: "id",
        });

        folderId = folder.data.id;
        console.log(`Created folder: ${folderName}, ID: ${folderId}`);
    }
  
    // Iterate through the local folder contents
    const items = fs.readdirSync(folderPath);
  
    for (const item of items) {
      const itemPath = path.join(folderPath, item);
      const stats = fs.statSync(itemPath);
  
      if (stats.isFile()) {
        // Upload the file
        // const fileMetadata = {
        //   name: item,
        //   parents: [folder.data.id],
        // };
  
        // const media = {
        //   mimeType: mime.getType(itemPath),
        //   body: fs.createReadStream(itemPath),
        // };
  
        // const file = await drive.files.create({
        //   requestBody: fileMetadata,
        //   media: media,
        //   fields: "id",
        // });
        await uploadFile(drive, itemPath, folderId);

      } else if (stats.isDirectory()) {
        // Recursively upload the subfolder
        await uploadFolder(drive, itemPath, folderId);
      }
    }
    return folderId
}

export async function backup(paths: string[], rootId: string) {
  const drive = google.drive({
      version: 'v3',
      auth: authClient
  });

  // await cleanupDeletedFiles(drive, paths, rootId); 
  //// only works for individual files. deletes folders if files inside it are marked for backup which in not intended behaviour

  try {
    const info = await drive.about.get({
        fields:'user' 
    })

    const user = await User.findOne({
        email: info.data.user?.emailAddress
    })

    const watchroots = Array.isArray(user?.rootpaths) ? user.rootpaths : [];

    for (const filePath of paths) {
        const stat = fs.statSync(filePath);
  
        if (stat.isDirectory()) {
            console.log(`Uploading folder: ${filePath}`);
            await uploadFolder(drive, filePath, rootId);  // Already handles nested folders internally
        } else if (stat.isFile()) {

            const watchRoot = watchroots.find(root => 
                filePath.startsWith(root) || root === filePath
            );
            
            if (!watchRoot) {
                console.log(`No matching watchRoot found for: ${filePath}`);
                continue; // Skip files without a known watchRoot
            }

            
            const baseFolderName = path.basename(watchRoot);
            const relativePath = path.relative(watchRoot, filePath);
            const folderPath = path.dirname(relativePath);

            if (folderPath === '.') {
                // Directly upload individual files to root folder without creating extra folders
                console.log(`Uploading file: ${filePath}`);
                await uploadFile(drive, filePath, rootId);
            } else {
                // Handle nested folder structure
                console.log(`Uploading file: ${filePath}`);
                const folderId = await createNestedFolders(drive, path.join(baseFolderName, folderPath), rootId);
                await uploadFile(drive, filePath, folderId);
            }
        }
    }
  } catch (error) {
    console.log(error)
    return
  }
  

}

async function createNestedFolders(drive, folderPath: string, rootId: string): Promise<string> {
  if (!folderPath || folderPath === '.') return rootId; // Root-level file, no folders needed
    // ./user/f1/f2/f3
  const folders = folderPath.split(path.sep); // Split by `/` or `\` depending on OS
  let currentParentId = rootId;

  for (const folderName of folders) {
      const res = await drive.files.list({
          q: `'${currentParentId}' in parents and name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
          fields: 'files(id)'
      });

      if (res.data.files && res.data.files.length > 0) {
          currentParentId = res.data.files[0].id as string; // Folder exists
      } else {
          const folder = await drive.files.create({
              resource: {
                  name: folderName,
                  mimeType: 'application/vnd.google-apps.folder',
                  parents: [currentParentId]
              },
              fields: 'id'
          });

          currentParentId = folder.data.id as string;
      }
  }

  return currentParentId; // Return the deepest folder's ID
}


async function cleanupDeletedFiles(drive, localFiles: string[], rootFolderId: string) {
  try {
      // Step 1: List all files in the Google Drive folder
      const driveFiles = await drive.files.list({
          q: `'${rootFolderId}' in parents and trashed = false`,
          fields: 'files(id, name)'
      });

      const driveFileMap = new Map<string, string>(
        (driveFiles.data.files || [])
            .filter(file => file.name) // Filter out entries with undefined names
            .map(file => [file.name as string, file.id as string]) // Assert types
      );

      // Step 2: Identify files that are missing locally
      const localFileNames = new Set(localFiles.map(file => path.basename(file)));

      for (const [fileName, fileId] of driveFileMap) {
          if (!localFileNames.has(fileName)) {
              console.log(`Deleting ${fileName} from Drive...`);
              await drive.files.delete({ fileId });
              console.log(`Deleted: ${fileName}`);
          }
      }

      console.log('Cleanup complete.');
  } catch (error) {
      console.error('Error during cleanup:', error);
  }
}


export function computeFileHash(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
}

export async function cleanUpWatchers() {
  console.log("Watcher cleanup started");

  // Iterate through all watchers in the Map
  for (const [path, watcher] of activeWatchers.entries()) {
      await watcher.close(); // Close each watcher
      console.log(`Watcher closed for path: ${path}`);
  }
  
  activeWatchers.clear(); // Clear the Map
  console.log("All watchers cleared");
}

export async function downloadFile(drive: any, fileId: string, destPath: string) {
  const file = await drive.files.get(
      {
          fileId: fileId,
          alt: 'media',
          acknowledgeAbuse: true
      },
      { responseType: 'stream' }
  )

  const destStream = fs.createWriteStream(destPath)

  let bytesRead: number = 0

  await new Promise<void>((resolve, reject) => {
      file.data
          .on('data', (chunk) => {
              bytesRead += chunk.length
          })
          .on('end', () => {
              console.log(`Download completed. Total bytes read: ${bytesRead}B`)
              resolve()
          })
          .on('error', (err) => {
              console.error('Error during file download:', err)
              reject(err)
          })
          .pipe(destStream)
          .on('finish', () => {
              console.log('File successfully saved to:', destPath)
              resolve()
          })
          .on('error', (err) => {
              console.error('Error writing file:', err)
              reject(err)
          })
  })
}

export async function downloadFolder(drive: any, folderId: string, folderPath: string) {
  // Create the folder locally
  if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true })
  }

  const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType)'
  })

  for (const file of res.data.files || []) {
      const filePath = path.join(folderPath, file.name)

      if (file.mimeType === 'application/vnd.google-apps.folder') {
          await downloadFolder(drive, file.id, filePath) // Recursively download nested folders
      } else {
          await downloadFile(drive, file.id, filePath)
      }
  }
}