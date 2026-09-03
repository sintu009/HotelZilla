import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ToastProvider } from './components/Toast'
import useAuthStore from './lib/useAuthStore'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import HotelOwners from './pages/HotelOwners'
import OwnerDetail from './pages/OwnerDetail'
import Hotels from './pages/Hotels'
import HotelDetail from './pages/HotelDetail'
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
import WhiteLabel from './pages/WhiteLabel'

// ── Guards ────────────────────────────────────────────────
function RequireAuth({ children }) {
  const { token: isAuthenticated, loading } = useAuthStore()
  const location = useLocation()
  if (loading) return <div className="loading-center"><span className="spinner" /></div>
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

function RedirectIfAuth({ children }) {
  const { token: isAuthenticated, loading } = useAuthStore()
  if (loading) return <div className="loading-center"><span className="spinner" /></div>
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}

// ── Layouts ───────────────────────────────────────────────
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

// ── Routes ────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />

      {/* Protected */}
      <Route path="/*" element={
        <RequireAuth>
          <AdminLayout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users/customers" element={<Customers />} />
              <Route path="/users/hotel-owners" element={<HotelOwners />} />
              <Route path="/users/hotel-owners/:id" element={<OwnerDetail />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/detail/:id" element={<HotelDetail />} />
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
              <Route path="/white-label" element={<WhiteLabel />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AdminLayout>
        </RequireAuth>
      } />
    </Routes>
  )
}

function AppInit({ children }) {
  const init = useAuthStore((s) => s.init)
  useEffect(() => { init() }, [init])
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInit>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AppInit>
    </BrowserRouter>
  )
}
