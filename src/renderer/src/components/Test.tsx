import { Box, Button, Input } from "@chakra-ui/react"
import { useState } from "react"

const Test = () => {

  const [filePath,setFilePath] = useState<string>("")
  const [fileValue,setFileValue] = useState<string>("")
  const [fileList,setFileList] = useState<Array<any>>([])
  const [fileId,setFileId] = useState<string>("")

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
      await window.api.fileUpload(filePath);
    } catch (error) {
      console.log("error uploading file: ",error)
    }    
    setFileValue("")
  }
  
  const getFiles = async()=>{
    try {
      const resp = await window.api.getList();
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
      await window.api.folderUpload("C:/Users/prana_zhfhs6u/OneDrive/Desktop/destPath")
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <>
        <h1>testing api's</h1><br/>
        <div className="uploadFile">
          <input type="file" value={fileValue} onChange={fileChange}/>
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
    </>
  )
}

export default Test