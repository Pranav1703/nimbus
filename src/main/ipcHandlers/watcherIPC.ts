import { ipcMain } from "electron"
import chokidar, { FSWatcher } from "chokidar"
import { mainWindow } from "../index"
import { backup, computeFileHash } from "../helper"
import { User } from "../models/user";
import { IFileState } from "../models/state";

export const activeWatchers = new Map();
const filesToBackup = new Set<string>();

export let backupInterval: NodeJS.Timeout | null = null;

export const registerWatcherIPCHandlers = ()=>{

    ipcMain.handle("watch",async(_event,watchPaths:string[],rootId:string)=>{

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

        if(!backupInterval){
            backupInterval = setInterval(() => {
                if (filesToBackup.size > 0) {
                    console.log(`Backing up ${filesToBackup.size} file(s)...`);
                    const filesArray = [...filesToBackup];
                    (async()=>{
                        await backup(filesArray,rootId);
                    })();
                     //implement backup func for both files and folders in helper.ts
        
                    filesToBackup.clear(); // Clear the list after backup
                } else {
                    console.log("No new changes to backup.");
                }
                console.log("active watchers: ",activeWatchers.entries().toArray()[0])
            }, 60 * 1000);
            //6 * 60 * 60 * 1000
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

    ipcMain.handle("check-state",async(_event,email)=>{
        const user = await User.findOne({ email: email }).populate<{ fileStates: IFileState[] }>("fileStates");
        if(!user){
            console.log("no user found with given email")
            return
        }
    
        for(let state of user.fileStates){
            console.log(`path: ${state.path} --- hash: ${state.hash}`)
        }

    })

}