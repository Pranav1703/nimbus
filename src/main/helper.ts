import * as fs from 'fs';
import path from 'path';
import mime from 'mime';
import crypto from 'crypto';
import { activeWatchers } from './ipcHandlers/watcherIPC';
import { uploadResp } from './ipcHandlers/fileIPC';
import { authClient } from './ipcHandlers/userIPC';
import { drive_v3, google } from 'googleapis';

export async function uploadFile(drive: drive_v3.Drive, filePath:string,rootId:string):Promise<uploadResp> {
  const fileName = path.basename(filePath)

  const requestBody = {
      name: fileName,
      fields: 'id',
      parents: [rootId]
  }

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
  
    // Create the folder in Google Drive
    const folderMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentFolderId ? [parentFolderId] : [],
    };
  
    const folder = await drive.files.create({
      requestBody: folderMetadata,
      fields: "id",
    });
  
    console.log(`Created folder: ${folderName}, ID: ${folder.data.id}`);
  
    // Iterate through the local folder contents
    const items = fs.readdirSync(folderPath);
  
    for (const item of items) {
      const itemPath = path.join(folderPath, item);
      const stats = fs.statSync(itemPath);
  
      if (stats.isFile()) {
        // Upload the file
        const fileMetadata = {
          name: item,
          parents: [folder.data.id],
        };
  
        const media = {
          mimeType: mime.getType(itemPath),
          body: fs.createReadStream(itemPath),
        };
  
        const file = await drive.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: "id",
        });
  
        console.log(`Uploaded file: ${item}, ID: ${file.data.id}`);
      } else if (stats.isDirectory()) {
        // Recursively upload the subfolder
        await uploadFolder(drive, itemPath, folder.data.id);
      }
    }
    return folder.data.id
}

export async function backup(paths: string[], rootId: string) {
  const drive = google.drive({
      version: 'v3',
      auth: authClient
  });

  
  // await cleanupDeletedFiles(drive, paths, rootId); 
  //// only works for individual files. deletes folders if files inside it are marked for backup which in not intended behaviour

  for (const filePath of paths) {
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
          console.log(`Uploading folder: ${filePath}`);
          await uploadFolder(drive, filePath, rootId);  // Already handles nested folders internally
      } else if (stat.isFile()) {
          const relativePath = path.relative(watchRoot, filePath); // Relative path for folder structure
          const folderPath = path.dirname(relativePath); // Extract folder structure

          // Create or locate the correct folder hierarchy in Drive
          const folderId = await createNestedFolders(drive, folderPath, rootId);

          console.log(`Uploading file: ${filePath} to ${folderPath}`);
          await uploadFile(drive, filePath, folderId);
      }
  }
}

async function createNestedFolders(drive, folderPath: string, rootId: string): Promise<string> {
  if (!folderPath || folderPath === '.') return rootId; // Root-level file, no folders needed

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