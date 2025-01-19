// import Hero from './Pages/Hero'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import Test from './Test/Test'
import Sidebar from './components/Sidebar'
import Dashboard from './Pages/Dashboard'
import Files from './Pages/Files'
import Backup from './Pages/Backup'
import Versions from './Pages/Versions'
import Settings from './Pages/Settings'
import Test2 from './Test/Test2'

function App(): JSX.Element {
  // const googleAuthorise = async () => {
  //   try {
  //     const resp = await window.api.authorizeUser()
  //     if (resp) {
  //       console.log(res)
  //       return true
  //     }
  //     return false
  //   } catch (error) {
  //     console.log(error)
  //     return false
  //   }
  // }
  return (
    <>
      <HashRouter>
        <Routes>
          {/* <Route path="/" element={googleAuthorise() ? <Sidebar /> : <Hero/>} /> */}
          <Route path="/" element={<Navigate to="/Dashboard" />} />
          <Route path="/" element={<Sidebar />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="Files" element={<Files />} />
            <Route path="Backup" element={<Backup />} />
            <Route path="Versions" element={<Versions />} />
            <Route path="Settings" element={<Settings />} />
            <Route path="test" element={<Test />} />
            <Route path="test2" element={<Test2 />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
