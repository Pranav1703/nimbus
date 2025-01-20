import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

function Layout():JSX.Element {
  return (
    <>
        <Sidebar/>
        <Outlet />
    </>
  )
}

export default Layout