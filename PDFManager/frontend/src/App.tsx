import { Routes, Route, Navigate } from 'react-router-dom'

import Header from './components/Header'
import './App.css'
import Footer from './components/Footer'
import Home from './pages/Home'
import DividePdf from './pages/DividePdf'
import CreateBlank from './pages/CreateBlank'
import MergePdf from './pages/MergePdf'
import CompressPdf from './pages/CompressPdf'
import CompressZip from './pages/CompressZip'
import Password from './pages/Password'



function App() {

  return (
    <>
      <Header />

      <main>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/CreateBlank" element={< CreateBlank />} />
          <Route path="/DividePdf" element={<DividePdf />} />
          <Route path="/MergePdf" element={<MergePdf />} />
          <Route path="/CompressPdf" element={<CompressPdf />}/>
          <Route path="/CompressZip" element={<CompressZip />}/>
          <Route path="/Password" element={<Password></Password>}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />




    </>
  )
}

export default App
