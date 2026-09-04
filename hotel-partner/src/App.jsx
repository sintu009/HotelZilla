import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import RequireAuth from './lib/RequireAuth'
import Dashboard from './pages/Dashboard'
import MyHotels from './pages/MyHotels'
import HotelDetail from './pages/HotelDetail'
import Bookings from './pages/Bookings'
import Rooms from './pages/Rooms'
import Reviews from './pages/Reviews'
import Earnings from './pages/Earnings'
import Settings from './pages/Settings'
import PartnerLogin from './pages/PartnerLogin'
import HotelLanding from './pages/public/HotelLanding'
import HotelRooms from './pages/public/HotelRooms'
import BookingPage from './pages/public/BookingPage'
import BookingConfirmation from './pages/public/BookingConfirmation'
import { WHITE_LABEL, applyWhiteLabel } from './lib/whiteLabel'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const PARTNER_ID = new URLSearchParams(window.location.search).get('partner')
  || import.meta.env.VITE_PARTNER_ID
  || null

function DashboardLayout({ children }) {
  return (
    <div className="partner-layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content">{children}</div>
      </div>
    </div>
  )
}

function ProtectedDashboard({ children }) {
  return (
    <RequireAuth>
      <DashboardLayout>{children}</DashboardLayout>
    </RequireAuth>
  )
}

export default function App() {
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('hotel')
      || import.meta.env.VITE_PARTNER_ID
    if (id) {
      fetch(`${BASE}/api/public/hotel-config/${id}`)
        .then(r => r.json())
        .then(config => applyWhiteLabel(config))
        .catch(() => applyWhiteLabel(WHITE_LABEL))
    } else {
      applyWhiteLabel(WHITE_LABEL)
    }
  }, [])

  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Public hotel website */}
          <Route path="/" element={<HotelLanding />} />
          <Route path="/rooms" element={<HotelRooms />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/book/done" element={<BookingConfirmation />} />

          {/* Partner auth */}
          <Route path="/login" element={<PartnerLogin />} />

          {/* Partner dashboard — protected */}
          <Route path="/dashboard" element={<ProtectedDashboard><Dashboard /></ProtectedDashboard>} />
          <Route path="/dashboard/hotels" element={<ProtectedDashboard><MyHotels /></ProtectedDashboard>} />
          <Route path="/dashboard/hotels/:id" element={<ProtectedDashboard><HotelDetail /></ProtectedDashboard>} />
          <Route path="/dashboard/bookings" element={<ProtectedDashboard><Bookings /></ProtectedDashboard>} />
          <Route path="/dashboard/rooms" element={<ProtectedDashboard><Rooms /></ProtectedDashboard>} />
          <Route path="/dashboard/reviews" element={<ProtectedDashboard><Reviews /></ProtectedDashboard>} />
          <Route path="/dashboard/earnings" element={<ProtectedDashboard><Earnings /></ProtectedDashboard>} />
          <Route path="/dashboard/settings" element={<ProtectedDashboard><Settings /></ProtectedDashboard>} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
