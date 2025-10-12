import {Routes , Route , Link} from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './components/Header'
import './App.css'
import Footer from './components/Footer'
import Home from './pages/Home'
import DividePdf from './pages/DividePdf'
import CreateBlank from './pages/CreateBlank'



function App() {

  return (
    <>
    <Header/>

      <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/CreateBlank" element={< CreateBlank/>} />
        <Route path="/DividePdf" element={<DividePdf />} />
      </Routes>
      </main>

    <Footer/>

      

    
    </>
  )
}

export default App
