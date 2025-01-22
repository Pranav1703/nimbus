import { ipcMain } from "electron"
import chokidar from "chokidar"

export const registerWatcherIPCHandlers = ()=>{
    ipcMain.handle("watch",async(_event,watchPaths:string)=>{
        const watcher = chokidar.watch([watchPaths],{
            persistent: true
        })

        watcher.on('all',(event,path)=>{
            console.log(`Event: ${event} occurred on ${path}`);
        })
    })
}