import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import MyHotels from './pages/MyHotels'
import HotelDetail from './pages/HotelDetail'
import Bookings from './pages/Bookings'
import Rooms from './pages/Rooms'
import Reviews from './pages/Reviews'
import Earnings from './pages/Earnings'
import Settings from './pages/Settings'

function Layout({ children }) {
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

function AppRoutes() {
  const { pathname } = useLocation()
  return (
    <Routes>
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hotels" element={<MyHotels />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
