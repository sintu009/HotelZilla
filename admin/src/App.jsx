import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
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
import { useEffect } from 'react'

function ProtectedRoute({ children }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (profile && profile.role !== 'admin') return <Navigate to="/login" replace />
  return children
}

function AdminLayout({ children }) {
  const location = useLocation()
  const titles = {
    '/dashboard': 'Dashboard',
    '/users/customers': 'Customers',
    '/users/hotel-owners': 'Hotel Owners',
    '/hotels': 'All Hotels',
    '/hotels/pending': 'Pending Approval',
    '/hotels/approved': 'Approved Hotels',
    '/hotels/rejected': 'Rejected Hotels',
    '/bookings': 'Bookings',
    '/payments': 'Payments',
    '/refunds': 'Refunds',
    '/reviews': 'Reviews',
    '/offers': 'Offers',
    '/coupons': 'Coupons',
    '/commissions': 'Commissions',
    '/reports/revenue': 'Revenue Report',
    '/reports/bookings': 'Bookings Report',
    '/reports/hotels': 'Hotels Report',
    '/reports/customers': 'Customers Report',
    '/cms/homepage': 'Homepage CMS',
    '/cms/banners': 'Banners CMS',
    '/cms/destinations': 'Destinations CMS',
    '/cms/offers': 'Offers CMS',
    '/settings': 'Settings',
  }
  const title = titles[location.pathname] || 'StayFinder Admin'

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main">
        <div className="topbar">
          <div className="topbar-title">{title}</div>
          <div className="topbar-actions">
            <a href="/" target="_blank" className="btn btn-secondary btn-sm">View Site</a>
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <ProtectedRoute>
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
        </ProtectedRoute>
      } />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
