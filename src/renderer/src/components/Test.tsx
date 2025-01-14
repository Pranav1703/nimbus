import { Button } from "@chakra-ui/react"

const Test = () => {
  
  return (
    <>
        <h1>testing api's</h1><br/>
        
        <Button m={'15ps'}>
          Upload File
        </Button>
        <br/>
        <Button m={'15ps'}>
          Upload Folder
        </Button>
        <br/>
        <Button m={'15ps'}>
          download file
        </Button>
        <br/>
    </>
  )
}

export default Test