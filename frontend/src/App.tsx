
import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import About from './pages/About'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
 return   <div className='text-white font-kumbh bg-[#141414] min-h-screen overflow-y-auto  '>
  <Routes >
    <Route path='/' element={<Landing />} />
    <Route path='/about' element={<About />} />
    <Route path='/contact' element={<Contact />} />
    <Route path='/terms' element={<Terms />} />
    <Route path='/login' element={<Login />}/>
    <Route path='/signup' element={<Signup />}/>
  </Routes>
   
</div>
 

}

export default App
