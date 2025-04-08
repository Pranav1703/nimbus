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
import { useAlert } from './components/Alert'

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
    const [colorPalette, setColorPalette] = useState('teal') // Default color
    const { setTheme } = useTheme()
    const { addAlert, removeAlert } = useAlert() // Now supports manual removal
    const [wasOffline, setWasOffline] = useState(!navigator.onLine)
    const offlineAlertId = useRef<number | null>(null) // Track the alert ID
    const [rootId, setRootId] = useState<string>('')
    const hasRun = useRef(false)
    const [Name, setName] = useState('')
    const [Image, setImage] = useState('')
    //Setting the theme when opened
    window.api.storeGet('Color_Pallet').then((color) => {
        if (color) {
            setColorPalette(color)
        }
    })
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
                    await getRoot()
                    hasRun.current = true
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const initializeWatchers = async()=>{
        await getRoot()
        const paths = await window.api.getWatchPaths() as string[]
        await window.api.initWatcher(paths,rootId,5*60*1000)
    }
    useEffect(() => {
        (async()=>{
            await checkUserToken()
            await initializeWatchers()
        })();
    }, [])

    setTheme('dark')

    useEffect(() => {
        const handleOffline = (): void => {
            if (!wasOffline) {
                offlineAlertId.current = addAlert('warning', 'You are offline', null) // Sticky alert
                setWasOffline(true)
            }
        }

        const handleOnline = (): void => {
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

        return (): void => {
            window.removeEventListener('offline', handleOffline)
            window.removeEventListener('online', handleOnline)
        }
    }, [wasOffline])
    // console.log('You are in app')
    const fetchNameandImage = async (): Promise<void> => {
        const name = await window.api.storeGet('Name')
        const image = await window.api.storeGet('Image')
        setName(name || '')
        setImage(image || '')
    }

    useEffect(() => {
        fetchNameandImage()
    }, []) // Runs once on mount
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
                                    <Route path="/" element={<Layout name={Name} Image={Image}/>}>
                                        <Route
                                            path="Dashboard"
                                            element={<Dashboard selectedColor={colorPalette} />}
                                        />
                                        <Route path="Files" element={<Files rootId={rootId} />} />
                                        <Route path="Backup" element={<Backup rootId={rootId} />} />
                                        <Route path="Versions" element={<Versions />} />
                                        <Route
                                            path="Settings"
                                            element={
                                                <Settings
                                                    selectedColor={colorPalette}
                                                    onChange={setColorPalette}
                                                    fetchName={fetchNameandImage}
                                                    name={Name}
                                                    Image={Image}
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
