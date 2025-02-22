/* eslint-disable @typescript-eslint/no-unused-vars */
// import './assets/main.css'
import { Provider } from './components/ui/provider'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AlertProvider } from './components/Alert'
import { DarkMode } from './components/ui/color-mode'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider>
                <AlertProvider>
                    <App />
                </AlertProvider>
        </Provider>
    </React.StrictMode>
)
