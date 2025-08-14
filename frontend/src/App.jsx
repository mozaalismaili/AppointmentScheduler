import { Routes, Route } from 'react-router-dom'
import BookingPage from './BookingPage'
import LoginSignup from './components/LoginSignup/LoginSignup'
import './components/LoginSignup/LoginSignup.css' // إذا المكوّن لا يستورد CSS داخليًا

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BookingPage apiBaseUrl="http://localhost:3001" />} />
      <Route path="/login" element={<LoginSignup />} />
    </Routes>
  )
}
