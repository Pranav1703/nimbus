import { Box, Button, Input } from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../App"

const Test = () => {

  const [filePath,setFilePath] = useState<string>("")
  const [fileValue,setFileValue] = useState<string>("")
  const [fileList,setFileList] = useState<Array<any>>([])
  const [fileId,setFileId] = useState<string>("")
  const [hash,setHash] = useState<string>("")
  const [rootId,setRootId] = useState<string>("")
  const [backupPath,setBackupPath] = useState<string>("")
  const [backupFileValue,setBackupFileValue] = useState<string>("")
  const [backupFileId,setBackupFileId] = useState<string>("")


  // const fileStateCheck = async()=>{
  //   const userInfo = await window.api.getInfo()
  //   window.api.checkState(userInfo!.user?.emailAddress as string)
  // }

  // useEffect(() => {
  //   fileStateCheck()
  // }, [])
  

  // const fileChange = async()=>{
  //   // setFileValue(e.target.value)
  //   // const filePath = e.target.files![0].path
  //   setFilePath("D:/Btech/Btech-3/Sem-6/DATA WAREHOUSING AND MINING/Theory/Unit-1/1.1 Additional Topics.pdf")
  //   console.log(filePath)
  // }

  // const uploadFile = async() => {
  //   if(filePath.length===0){
  //     console.log("no filePath provided.")
  //     return
  //   }
  //   try {
  //     console.log(filePath)
  //     const {id} = await window.api.fileUpload(filePath,rootId);
  //   } catch (error) {
  //     console.log("error uploading file: ",error)
  //   }    
  //   setFileValue("")
  // }
  
  // const getFiles = async()=>{
  //   try {
  //     const resp = await window.api.getList(rootId);
  //     console.log("file list array: ",resp)
  //     setFileList(resp)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const deleteHandler = async()=>{
  //   try {
  //     await window.api.deleteFile(fileId)
  //   } catch (error) {
  //     console.log(error)
  //   }
  //   setFileId("")
  //   await getFiles()
  // }

  // const downloadFile = async(id:string,destPath)=>{
  //   console.log("id clicked:", id)
  //   try {
  //     await window.api.downloadFile(id,destPath)
  //   } catch (error) {
  //    console.log("error while downloading the file. ",error) 
  //   }
  // }

  // const DownloadBtn = ({id,name})=>{
  //   //C:\Users\prana_zhfhs6u\OneDrive\Desktop\destPath\{filename.ext}  //test path
  //   const destPath = `C:/Users/shanm/Desktop/New folder/${name}`
  //   return(
  //     <Box
  //     display={"flex"}
  //     justifyContent={"space-between"}
  //     >
  //       <Button m={'1px'} onClick={()=>{downloadFile(id,destPath)}}>
  //         download File
  //       </Button>
  //     </Box>
  //   )
  // } 

  // const uploadFolder = async()=>{
  //   try {
  //     await window.api.folderUpload("C:/Users/shanm/Desktop/New folder",rootId)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  
  // const userInfoLogger = async()=>{
  //   try {
  //     const info = await window.api.getInfo()  //user, storageQuota in Bytes, maxUploadSize
  //     console.log("user info: ",info?.user)
  //     console.log("storageQuota: ",info?.storageQuota)
  //     console.log("maxUploadSize: ",info?.maxUploadSize)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const watcher = async()=>{
  //   try {
  //     await window.api.initWatcher(["C:/Users/prana_zhfhs6u/OneDrive/Desktop/testing/watchThis.txt"])      
      
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const generateHash = async()=>{
  //   try {
  //     const hash = await window.api.getFileHash(filePath)
  //     setHash(hash)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const createRoot = async()=>{
  //   const resp = await window.api.createRoot() // true - root created,  false - root already exists
  //   console.log(resp)
  // }

  // const getRoot = async()=>{
  //   const rootId = await window.api.getRoot()
  //   if(rootId){
  //     setRootId(rootId)
  //   }
  // }

  // const backupFileChange = async(e:React.ChangeEvent<HTMLInputElement>)=>{
  //   setBackupFileValue(e.target.value)
  //   const filePath = e.target.files![0].path
  //   setBackupPath(filePath)
  // }


  const watchTest = async()=>{
    const root = await window.api.getRoot() as string
    await window.api.initWatcher(["C:/Users/prana_zhfhs6u/OneDrive/Desktop/testing","C:\\Users\\prana_zhfhs6u\\OneDrive\\Desktop\\link.txt"],root, 30 * 1000)
  } 
  const navigate = useNavigate()

  const {setUser} = useContext(UserContext)

  const logout = async()=>{
    await window.api.disconnect()
    setUser(false)

  }

  return (
    <>
        <h1>testing api's</h1><br/>
        {/* <div className="uploadFile">
          <input type="file" onChange={fileChange}/>
          <Button 
          m={'10px'}
          onClick={fileChange}
          >
            set file path
          </Button>
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
          onClick={userInfoLogger}
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
        </div> */}

        <Button onClick={watchTest}>
          test
        </Button>

        <Button onClick={logout}>
          logout
        </Button>

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