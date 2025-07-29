import { Routes, Route } from 'react-router-dom'
import Inference from './components/Inference'
import Repl from './components/Repl'
import NotFound from './components/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inference />} />
      <Route path="/code/:replId" element={<Repl />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App