import * as fs from 'fs';
import path from 'path';
import mime from 'mime';
// import { drive_v3 } from 'googleapis';

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
