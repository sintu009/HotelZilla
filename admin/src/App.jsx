import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import HotelOwners from './pages/HotelOwners'
import Hotels from './pages/Hotels'
import Bookings from './pages/Bookings'
import Payments from './pages/Payments'
import Refunds from './pages/Refunds'
import Reviews from './pages/Reviews'
import Offers from './pages/Offers'
import Coupons from './pages/Coupons'
import Commissions from './pages/Commissions'
import Reports from './pages/Reports'
import CMS from './pages/CMS'
import Settings from './pages/Settings'

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content">{children}</div>
      </div>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/*" element={
        <AdminLayout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users/customers" element={<Customers />} />
            <Route path="/users/hotel-owners" element={<HotelOwners />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:status" element={<Hotels />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/commissions" element={<Commissions />} />
            <Route path="/reports/:type" element={<Reports />} />
            <Route path="/cms/:section" element={<CMS />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AdminLayout>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  )
}
