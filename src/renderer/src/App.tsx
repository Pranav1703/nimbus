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
import { createContext, useEffect, useState } from 'react'
import Hero from './Pages/Hero'
import Layout from './components/Layout'
import { useTheme } from 'next-themes'
import CustomChakraProvider from './components/CustomChakraProvider'

type userContext = {
  user: boolean
  setUser: React.Dispatch<React.SetStateAction<boolean>>
}

export const UserContext = createContext<userContext>({
  user: false,
  setUser: ()=>{}
})


function App(): JSX.Element {
  const [user, setUser] = useState(false)
 
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
  useEffect(() => {
    checkUserToken()
  }, [])

  //Adding the color palette state
  const [colorPalette, setColorPalette] = useState('teal'); // Default color


  //Settind the default mode to dark
  const { setTheme } = useTheme()
  setTheme('dark')

  return (
    <>
    <CustomChakraProvider colorPalette={colorPalette}>
      <UserContext.Provider value={{user,setUser}}>
        <HashRouter>
          <Routes>
            {user ? (
              <>
                <Route path="/" element={<Navigate to="/Dashboard" />} />
                <Route path="/" element={<Layout />}>
                  <Route path="Dashboard" element={<Dashboard selectedColor={colorPalette} />} />
                  <Route path="Files" element={<Files />} />
                  <Route path="Backup" element={<Backup />} />
                  <Route path="Versions" element={<Versions />} />
                  <Route path="Settings" element={<Settings selectedColor={colorPalette} onChange={setColorPalette} />} />
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
      </UserContext.Provider>
      </CustomChakraProvider>
    </>
  )
}

export default App
