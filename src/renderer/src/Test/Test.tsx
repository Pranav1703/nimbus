import { Box, Button, Input } from "@chakra-ui/react"
import { useState } from "react"

const Test = () => {

  const [filePath,setFilePath] = useState<string>("")
  const [fileValue,setFileValue] = useState<string>("")
  const [fileList,setFileList] = useState<Array<any>>([])
  const [fileId,setFileId] = useState<string>("")
  const [hash,setHash] = useState<string>("")
  const [rootId,setRootId] = useState<string>("")
  const [backupPath,setBackupPath] = useState<string>("")
  const [backupFileValue,setBackupFileValue] = useState<string>("")

  const fileChange = async(e:React.ChangeEvent<HTMLInputElement>)=>{
    setFileValue(e.target.value)
    const filePath = e.target.files![0].path
    setFilePath(filePath)
  }

  const uploadFile = async() => {
    if(filePath.length===0){
      console.log("no filePath provided.")
      return
    }
    try {
      console.log(filePath)
      await window.api.fileUpload(filePath,rootId);
    } catch (error) {
      console.log("error uploading file: ",error)
    }    
    setFileValue("")
  }
  
  const getFiles = async()=>{
    try {
      const resp = await window.api.getList(rootId);
      console.log("file list array: ",resp)
      setFileList(resp)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteHandler = async()=>{
    try {
      await window.api.deleteFile(fileId)
    } catch (error) {
      console.log(error)
    }
    setFileId("")
    await getFiles()
  }

  const downloadFile = async(id:string,destPath)=>{
    console.log("id clicked:", id)
    try {
      await window.api.downloadFile(id,destPath)
    } catch (error) {
     console.log("error while downloading the file. ",error) 
    }
  }

  const DownloadBtn = ({id,name})=>{
    //C:\Users\prana_zhfhs6u\OneDrive\Desktop\destPath\{filename.ext}  //test path
    const destPath = `C:/Users/prana_zhfhs6u/OneDrive/Desktop/destPath/${name}`
    return(
      <Box
      display={"flex"}
      justifyContent={"space-between"}
      >
        <Button m={'1px'} onClick={()=>{downloadFile(id,destPath)}}>
          download File
        </Button>
      </Box>
    )
  } 

  const uploadFolder = async()=>{
    try {
      await window.api.folderUpload("C:/Users/prana_zhfhs6u/OneDrive/Desktop/destPath",rootId)
    } catch (error) {
      console.log(error)
    }
  }
  
  const logger = async()=>{
    try {
      const info = await window.api.getInfo()  //user, storageQuota in Bytes, maxUploadSize
      console.log("user info: ",info?.user)
      console.log("storageQuota: ",info?.storageQuota)
      console.log("maxUploadSize: ",info?.maxUploadSize)
    } catch (error) {
      console.log(error)
    }
  }

  const watcher = async()=>{
    try {
      await window.api.initWatcher(["C:/Users/prana_zhfhs6u/OneDrive/Desktop/testing/watchThis.txt"])      
      
      window.api.onFileChange((_event,msg)=>{
        console.log(msg)
      })

    } catch (error) {
      console.log(error)
    }
  }

  const generateHash = async()=>{
    try {
      const hash = await window.api.getFileHash(filePath)
      setHash(hash)
    } catch (error) {
      console.log(error)
    }
  }

  const createRoot = async()=>{
    const resp = await window.api.createRoot() // true - root created,  false - root already exists
    console.log(resp)
  }

  const getRoot = async()=>{
    const rootId = await window.api.getRoot()
    if(rootId){
      setRootId(rootId)
    }
  }

  const backupFileChange = async(e:React.ChangeEvent<HTMLInputElement>)=>{
    setBackupFileValue(e.target.value)
    const filePath = e.target.files![0].path
    setBackupPath(filePath)
  }

  const backup = async()=>{
    const rootId = await window.api.getRoot()
    const userInfo = await window.api.getInfo()

    if(rootId && userInfo?.user?.emailAddress){
      await window.api.saveUser(userInfo.user.emailAddress,rootId)
      const resp = await window.api.fileUpload(backupPath,rootId)

    }

  }

  return (
    <>
        <h1>testing api's</h1><br/>
        <div className="uploadFile">
          <input type="file" onChange={fileChange}/>
          <Button 
          m={'10px'}
          onClick={uploadFile}
          >
            Upload File
          </Button>
        </div>

        <div className="fileList">
          <Button m={'15px'} onClick={getFiles}>
            show file list
          </Button>
          {
            fileList.length>0?(
              <table border={1} style={{ marginTop: '10px', width: '65%' }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Id</th>
                  <th>------</th>
                </tr>
              </thead>
              <tbody>
                {fileList.map((file) => (
                  <tr key={file.id}>
                    <td>{file.name}</td>
                    <td>{file.id}</td>
                    <td>
                      <DownloadBtn id={file.id} name={file.name}/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            ):(
              <p>No files found in drive.</p>
            )
          }
        </div>
        
        <br/>

        <div className="uploadFolder">
          <Button m={'15px'}
          onClick={uploadFolder}>
            Upload Folder
          </Button>
        </div>

        <br/>

        <div className="download">
          <Button m={'15px'}>
            download file
          </Button>
        </div>
        <br/>
        <div className="delete">
          <Input placeholder="enter fileID" value={fileId} onChange={(e)=>setFileId(e.target.value)}/>
          <Button m={'15px'}
          onClick={deleteHandler}
          >
            delete file
          </Button>
        </div>
        <div className="log">
          <Button
          m={10}
          onClick={logger}
          >
            Log response
          </Button>

          <Button
          m={5}
          onClick={watcher}
          >
            Initialize Watchers
          </Button>

          <Button
          m={10}
          onClick={createRoot}
          >
            create ROot folder
         </Button>

          <Button
          m={10}
          onClick={getRoot}
          >
            get Root id
          </Button>
          <p>rootId-{rootId}</p>
        </div>

        <div className="hash">
          <input type="file" value={fileValue} onChange={fileChange}/>
          <Button 
          m={'10px'}
          onClick={generateHash}
          >
            generate Hash
          </Button>
          <p>{hash}</p>
        </div>

        <div className="flow">
          <Input type="file" value={backupFileValue} onChange={backupFileChange}/>
          <Button
          m={10}
          onClick={backup}
          >
            BackUp
          </Button>
        </div>

    </>
  )
}

export default Test
/*
flow div 
1. login
2. get rootId after root gets created
3. save user mail, rootID in DB
4. select path{
    i.    init watcher on said path
    ii.   upload file/folder to drive, save file path in DB
    iii.  wait for schedule time to backup again.
   }

*/