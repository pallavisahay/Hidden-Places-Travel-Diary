import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from './pages/home/Home'
import SignUp from './pages/Auth/SignUp'
import Login from './pages/Auth/login'

const App = () => {
  return (
   <>
   <BrowserRouter>
   <Routes>
    <Route path="/"exact element={<Home />}/>
 <Route path="/login" element={<Login/>} />
     <Route path="/sign-up"exact element={<SignUp />}/>
    
    

   </Routes>
   </BrowserRouter>
   </>
  )
}

export default App