import { ipcMain } from "electron"
import chokidar, { FSWatcher } from "chokidar"
import { mainWindow } from "../index"
import { computeFileHash } from "./helper"

export const activeWatchers: Set<FSWatcher> = new Set();

export const registerWatcherIPCHandlers = ()=>{
    ipcMain.handle("watch",async(_event,watchPaths:string[])=>{
        const watcher = chokidar.watch(watchPaths,{
            persistent: true,
            ignoreInitial: true
        })

        console.log(`watcher initialized on paths: ${watchPaths}`)
        // "C:\Users\prana_zhfhs6u\OneDrive\Desktop\testing"
        activeWatchers.add(watcher)
        let fileState:string;
        watcher.on('all',(event,path)=>{
            console.log(`Event: ${event} occurred on ${path}`);
            fileState = `Event: ${event} occurred on ${path}`;
            mainWindow.webContents.send("file-change",fileState)
        })
        watcher.on("error", (error) => {
            console.error("Watcher error:", error);
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

}