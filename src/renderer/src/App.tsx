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
import { createContext, useEffect, useRef, useState } from 'react'
import Hero from './Pages/Hero'
import Layout from './components/Layout'
import { useTheme } from 'next-themes'
import CustomChakraProvider from './components/CustomChakraProvider'
import { AlertProvider, useAlert } from './components/Alert'

type userContext = {
    user: boolean
    setUser: React.Dispatch<React.SetStateAction<boolean>>
}

export const UserContext = createContext<userContext>({
    user: false,
    setUser: () => {}
})

function App(): JSX.Element {
    const [user, setUser] = useState(false)
    //Adding the color palette state
    const [colorPalette, setColorPalette] = useState('teal') // Default color
    //Settind the default mode to dark
    const { setTheme } = useTheme()
    //Cheking if there is in ternet connection
    const { addAlert, removeAlert } = useAlert() // Now supports manual removal
    const [wasOffline, setWasOffline] = useState(!navigator.onLine)
    const offlineAlertId = useRef<number | null>(null) // Track the alert ID
    const [rootId, setRootId] = useState<string>('')
    const hasRun = useRef(false)

    const getRoot = async (): Promise<void> => {
        const create_root = await window.api.createRoot() // true - root created,  false - root already exists
        if (create_root) {
            addAlert('success', 'Hello There', 2000)
            const rootId = await window.api.getRoot()
            if (rootId) {
                setRootId(rootId)
                console.log(rootId)
            }
        } else {
            const rootId = await window.api.getRoot()
            if (rootId) {
                setRootId(rootId)
                addAlert('success', 'Welcome Back', 2000)
            }
            console.log(rootId)
        }
    }

    const checkUserToken = async (): Promise<void> => {
        try {
            const resp = await window.api.checkToken()
            if (resp) {
                // console.log(resp)
                setUser(true)
                if (!hasRun.current) {
                    getRoot()
                    hasRun.current = true
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        checkUserToken()

    }, [])

    setTheme('dark')

    useEffect(() => {
        const handleOffline = () => {
            if (!wasOffline) {
                offlineAlertId.current = addAlert('warning', 'You are offline', null) // Sticky alert
                setWasOffline(true)
            }
        }

        const handleOnline = () => {
            setWasOffline(false)

            // Remove the "You are offline" alert manually
            if (offlineAlertId.current !== null) {
                removeAlert(offlineAlertId.current)
                offlineAlertId.current = null
            }

            // Show a temporary success alert
            addAlert('success', 'You are back online', 3000)
        }

        // Initial check when the component mounts
        if (!navigator.onLine) {
            handleOffline()
        }

        window.addEventListener('offline', handleOffline)
        window.addEventListener('online', handleOnline)

        return () => {
            window.removeEventListener('offline', handleOffline)
            window.removeEventListener('online', handleOnline)
        }
    }, [wasOffline])
    // console.log('You are in app')
    console.log(rootId)
    return (
        <>
            <CustomChakraProvider colorPalette={colorPalette}>
                <UserContext.Provider value={{ user, setUser }}>
                    <HashRouter>
                        <Routes>
                            {user ? (
                                <>
                                    {/* If user is logged in, show the dashboard */}
                                    <Route path="/" element={<Navigate to="/Dashboard" />} />
                                    <Route path="/" element={<Layout />}>
                                        <Route
                                            path="Dashboard"
                                            element={<Dashboard selectedColor={colorPalette} />}
                                        />
                                        <Route path="Files" element={<Files rootId={rootId}/>} />
                                        <Route path="Backup" element={<Backup />} />
                                        <Route path="Versions" element={<Versions />} />
                                        <Route
                                            path="Settings"
                                            element={
                                                <Settings
                                                    selectedColor={colorPalette}
                                                    onChange={setColorPalette}
                                                />
                                            }
                                        />
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
