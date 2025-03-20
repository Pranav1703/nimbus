import { ipcMain } from "electron"
import chokidar from "chokidar"
// import { mainWindow } from "../index"
import { backup, computeFileHash } from "../helper"
import { BackupInfo } from "../models/backup";
import { User } from "../models/user";
import { google } from "googleapis";
import { authClient } from "./userIPC";
// import { User } from "../models/user";

export const activeWatchers = new Map();
const filesToBackup = new Set<string>();

export let backupInterval: NodeJS.Timeout | null = null;

export const registerWatcherIPCHandlers = ()=>{

    ipcMain.handle("watch",async(_event,watchPaths:string[],rootId:string,intervalTime:number)=>{

        const drive = google.drive({
            version: 'v3',
            auth: authClient
        })

        watchPaths.forEach((path) => {
            // Check if the path is already being watched
            if (activeWatchers.has(path)) {
                console.log(`Already watching: ${path}`);
                return;
            }

            // Create a new watcher
            const watcher = chokidar.watch(path, {
                persistent: true,
                ignoreInitial: true,
                awaitWriteFinish: {
                    stabilityThreshold: 200,
                    pollInterval: 100
                }
            });

            console.log(`Watcher initialized on path: ${path}`);
            activeWatchers.set(path, watcher);

            // Track files for backup
            watcher.on('all', (event, changedPath) => {
                if (event === 'add' || event === 'change' || event === 'unlink') {
                    filesToBackup.add(changedPath); // Collect files for backup
                    console.log(`Marked for backup: ${changedPath}`);
                    // console.log("filesToBackUP: ",filesToBackup)
                }
            });

            watcher.on("error", (error) => {
                console.error("Watcher error:", error);
            });

        });  

        try {

            const info = await drive.about.get({
                fields:'user'
            })

            const user = await User.findOne({
                email: info.data.user?.emailAddress
            })      

            // min interval time 5-10min
            if(!backupInterval){
                backupInterval = setInterval(async() => {
                    if (filesToBackup.size > 0) {
                        console.log(`Backing up ${filesToBackup.size} file(s)...`);
                        const filesArray = [...filesToBackup];
                        try {
                            await backup(filesArray,rootId);

                            // ping frontend(send notification,file name,time) and save backup time
                        
                            await BackupInfo.create({
                                
                            }) 
                        } catch (error) {
                            
                        }


                        filesToBackup.clear(); // Clear the list after backup
                    } else {
                        console.log("No new changes to backup.");
                    }
                    console.log("active watchers: ",activeWatchers.entries().toArray().length)
                }, intervalTime);
                //6 * 60 * 60 * 1000
            }

  
        } catch (error) {
            console.log(error)
        }

        

    })

    ipcMain.handle("get-hash",async(_event,filePath:string):Promise<string | null>=>{
        try {
            const hash = await computeFileHash(filePath)
            return hash
        } catch (error) {
            console.log(error)
            return null
        }

    })

    ipcMain.handle("stop-watching",async(_event)=>{
        for (const [path, watcher] of activeWatchers.entries()) {
            await watcher.close(); // Close each watcher
            console.log(`Watcher closed for path: ${path}`);
        }
        
        activeWatchers.clear(); // Clear the Map
        console.log("All watchers cleared");
    })
}