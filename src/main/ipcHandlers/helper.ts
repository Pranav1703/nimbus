import * as fs from 'fs';
import path from 'path';
import mime from 'mime';
import crypto from 'crypto';
import { activeWatchers } from './watcherIPC';

export async function uploadFolder(drive, folderPath:string, parentFolderId?:string) {
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

export async function cleanUpWatchers (){
  console.log("watcher clean up started")
  for (const watcher of activeWatchers) {
    await watcher.close();
    console.log("Watcher closed");
  }
  activeWatchers.clear();
}
