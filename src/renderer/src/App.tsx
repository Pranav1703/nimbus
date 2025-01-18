import Hero from './components/Hero'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Test from './components/Test'

function App(): JSX.Element {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/test' element={<Test/>} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
