import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import Header from './components/Header'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import HotelListing from './pages/HotelListing'
import HotelDetail from './pages/HotelDetail'
import Booking from './pages/Booking'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import RegisterHotel from './pages/RegisterHotel'
import Offers from './pages/Offers'
import MyBookings from './pages/MyBookings'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/*" element={
          <>
            <Header />
            <main style={{ minHeight: '60vh' }}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/hotels" element={<HotelListing />} />
                <Route path="/hotels/:id" element={<HotelDetail />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/register-hotel" element={<RegisterHotel />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/my-bookings" element={<MyBookings />} />
              </Routes>
            </main>
            <Footer />
          </>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
