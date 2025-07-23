import { Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard.jsx'
import Detail from './Detail.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/brewery/:id" element={<Detail />} />
    </Routes>
  )
}