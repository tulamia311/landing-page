import { HashRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Wiki from './pages/Wiki'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/wiki" element={<Wiki />} />
      </Routes>
    </HashRouter>
  )
}

export default App
