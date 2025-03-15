import { ipcMain } from "electron"
import chokidar, { FSWatcher } from "chokidar"
import { mainWindow } from "../index"
import { computeFileHash } from "../helper"
import { User } from "../models/user";
import { IFileState } from "../models/state";

export const activeWatchers = new Map();

export const registerWatcherIPCHandlers = ()=>{
    const recentChanges = new Set();
    ipcMain.handle("watch",async(_event,watchPaths:string[])=>{

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
            activeWatchers.set(path, watcher); // Store watcher by path

            // Handle change event
            watcher.on('all', (event, changedPath, stats) => {
                if (!recentChanges.has(changedPath)) {
                    recentChanges.add(changedPath);
                    console.log(`Event: ${event} on ${changedPath}`);
                    mainWindow.webContents.send("file-change", { event, changedPath });

                    // Remove from Set after 300 ms to allow future events
                    setTimeout(() => recentChanges.delete(changedPath), 300);
                }
            });

            // Handle errors
            watcher.on("error", (error) => {
                console.error("Watcher error:", error);
            });

            // Log total files being watched
            // const watchedPaths = watcher.getWatched();
            // const watcherCount = Object.values(watchedPaths).reduce((total, files) => total + files.length, 0);
            // console.log(`Total files being watched: ${watcherCount}`); 
            // not working

        });  

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