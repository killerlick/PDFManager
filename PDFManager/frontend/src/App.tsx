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
import MergePdf from './pages/MergePdf'
import CompressPdf from './pages/CompressPdf'
import CompressZip from './pages/CompressZip'



function App() {

  return (
    <>
    <Header/>

      <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/CreateBlank" element={< CreateBlank/>} />
        <Route path="/DividePdf" element={<DividePdf />} />
        <Route path="/MergePdf" element={<MergePdf/>} />
        <Route path="/CompressPdf" element={<CompressPdf/>}></Route>
        <Route path="/CompressZip" element={<CompressZip/>}></Route>
      </Routes>
      </main>

    <Footer/>

      

    
    </>
  )
}

export default App
