import Hero from './Pages/Hero'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import Test from './Test/Test'
import Test2 from './Test/Test2'
import Sidebar from './components/Sidebar'

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
          <Route path='/' element={<Sidebar/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
