
import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import About from './pages/About'
import Contact from './pages/Contact'
import Terms from './pages/Terms'

function App() {
 return   <div className='text-white font-kumbh '>
  <Routes >
    <Route path='/' element={<Landing />} />
    <Route path='/about' element={<About />} />
    <Route path='/contact' element={<Contact />} />
    <Route path='/terms' element={<Terms />} />
  </Routes>
   

 

}

export default App
