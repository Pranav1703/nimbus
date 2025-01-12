import Hero from './components/Hero'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
function App(): JSX.Element {
  // const ipcHandle = (): void => window.api.ipcHandle()


  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
