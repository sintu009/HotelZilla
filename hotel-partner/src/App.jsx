import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import PublicHeader from './components/PublicHeader'
import PublicFooter from './components/PublicFooter'
import Dashboard from './pages/Dashboard'
import MyHotels from './pages/MyHotels'
import HotelDetail from './pages/HotelDetail'
import Bookings from './pages/Bookings'
import Rooms from './pages/Rooms'
import Reviews from './pages/Reviews'
import Earnings from './pages/Earnings'
import Settings from './pages/Settings'
import PublicLanding from './pages/public/PublicLanding'
import PublicHotelListing from './pages/public/PublicHotelListing'
import PublicHotelDetail from './pages/public/PublicHotelDetail'
import PublicBooking from './pages/public/PublicBooking'
import { WHITE_LABEL, applyWhiteLabel } from './lib/whiteLabel'

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

function PublicLayout({ children }) {
  return (
    <>
      <PublicHeader />
      <main style={{ minHeight: '60vh' }}>{children}</main>
      <PublicFooter />
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public website */}
      <Route path="/" element={<PublicLanding />} />
      <Route path="/hotels" element={<PublicHotelListing />} />
      <Route path="/hotels/:id" element={<PublicHotelDetail />} />
      <Route path="/booking" element={<PublicBooking />} />

      {/* Partner dashboard */}
      <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
      <Route path="/dashboard/hotels" element={<DashboardLayout><MyHotels /></DashboardLayout>} />
      <Route path="/dashboard/hotels/:id" element={<DashboardLayout><HotelDetail /></DashboardLayout>} />
      <Route path="/dashboard/bookings" element={<DashboardLayout><Bookings /></DashboardLayout>} />
      <Route path="/dashboard/rooms" element={<DashboardLayout><Rooms /></DashboardLayout>} />
      <Route path="/dashboard/reviews" element={<DashboardLayout><Reviews /></DashboardLayout>} />
      <Route path="/dashboard/earnings" element={<DashboardLayout><Earnings /></DashboardLayout>} />
      <Route path="/dashboard/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
    </Routes>
  )
}

export default function App() {
  useEffect(() => {
    applyWhiteLabel(WHITE_LABEL)
  }, [])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
