import electronLogo from './assets/icon.png'
import { Button } from '@chakra-ui/react'


function App(): JSX.Element {
  const ipcHandle = (): void => window.api.ipcHandle()

  const func = (): void => window.api.testIpc()
  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <Button onClick={ipcHandle}>HI</Button>
      <Button onClick={func}>Hello</Button>
    </>
  )
}

export default App
