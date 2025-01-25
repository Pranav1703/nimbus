import { ipcMain } from "electron"
import chokidar from "chokidar"
import { mainWindow } from "../index"
import { computeFileHash } from "./helper"

export const registerWatcherIPCHandlers = ()=>{
    ipcMain.handle("watch",async(_event,watchPaths:string[])=>{
        const watcher = chokidar.watch(watchPaths,{
            persistent: true
        })
        // "C:\Users\prana_zhfhs6u\OneDrive\Desktop\testing"
        let fileState:string;
        watcher.on('all',(event,path)=>{
            console.log(`Event: ${event} occurred on ${path}`);
            fileState = `Event: ${event} occurred on ${path}`;
            mainWindow.webContents.send("file-change",fileState)
        })
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