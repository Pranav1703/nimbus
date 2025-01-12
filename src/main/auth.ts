import fs from 'fs/promises';
import path from 'path';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { app } from 'electron';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

// const currFilePath = fileURLToPath(import.meta.url)

// const TOKEN_PATH = path.join(process.cwd(),'src','main', 'token.json');
const TOKEN_PATH = path.join(app.getPath("userData"),'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'src', 'main', 'credentials.json');


async function loadSavedCredentialsIfExist(): Promise<OAuth2Client | null> {
  try {
    const content = await fs.readFile(TOKEN_PATH, 'utf8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials) as OAuth2Client;
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client: OAuth2Client): Promise<void> {
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
    expiry: client.credentials.expiry_date
  });
  
  await fs.writeFile(TOKEN_PATH, payload);
}


export async function authorize(): Promise<OAuth2Client> {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
}


// async function listFiles(authClient: OAuth2Client): Promise<void> {
//     try {
//         const drive = google.drive({ version: 'v3', auth: authClient });
//         const res = await drive.files.list({
//           pageSize: 10,
//           fields: 'nextPageToken, files(id, name)',
//         });
//         const files = res.data.files;
//         if (!files || files.length === 0) {
//           console.log('No files found.');
//           return;
//         }
      
//         console.log('Files:');
//         files.forEach((file) => {
//           console.log(`${file.name} (${file.id})`);
//         });
//     } catch (error) {
//         console.log(error)
//     }
// }

// authorize()
//     .then(listFiles)
//     .catch(console.error);



