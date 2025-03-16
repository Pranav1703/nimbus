import * as fs from 'fs';
import path from 'path';
import mime from 'mime';
import crypto from 'crypto';
import { activeWatchers } from './ipcHandlers/watcherIPC';

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