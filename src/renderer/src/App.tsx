// import Hero from './Pages/Hero'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import Test from './Test/Test'
import Dashboard from './Pages/Dashboard'
import Files from './Pages/Files'
import Backup from './Pages/Backup'
import Versions from './Pages/Versions'
import Settings from './Pages/Settings'
import Test2 from './Test/Test2'
import { useEffect, useState } from 'react'
import Hero from './Pages/Hero'
import Layout from './components/Layout'

function App(): JSX.Element {
  const [user, setUser] = useState(false)

  useEffect(() => {
    const checkUserToken = async (): Promise<void> => {
      try {
        const resp = await window.api.checkToken()
        if (resp) {
          console.log(resp)
          setUser(true)
        }
      } catch (error) {
        console.log(error)
      }
    }

    checkUserToken()
  }, [])
  // const googleAuthorise = async ():Promise<void> => {
  //   try {
  //     const resp = await window.api.checkToken()
  //     if (resp) {
  //       console.log(resp)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  return (
    <>
      <HashRouter>
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Navigate to="/Dashboard" />} />
              <Route path="/" element={<Layout />}>
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="Files" element={<Files />} />
                <Route path="Backup" element={<Backup />} />
                <Route path="Versions" element={<Versions />} />
                <Route path="Settings" element={<Settings />} />
                <Route path="test" element={<Test />} />
                <Route path="test2" element={<Test2 />} />
              </Route>
            </>
          ) : (
            <>
              <Route path="/" element={<Hero />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}

          <Route path="/login" element={<Login />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
