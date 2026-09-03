import { useParams } from 'react-router-dom'
import { useFetch } from '../lib/useFetch'
import { dashboardApi, bookingsApi, paymentsApi, customersApi, hotelsApi } from '../lib/api'
import { formatPrice } from '../lib/format'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#059669', '#f59e0b', '#ef4444', '#0ea5e9', '#8b5cf6', '#ec4899']

export default function Reports() {
  const { type } = useParams()

  const { data: stats }    = useFetch(() => dashboardApi.stats())
  const { data: bRes }     = useFetch(() => bookingsApi.list(1, 200))
  const { data: pRes }     = useFetch(() => paymentsApi.list(1, 200))
  const { data: cRes }     = useFetch(() => customersApi.list(1, 200))
  const { data: hRes }     = useFetch(() => hotelsApi.list(1, 200))

  const bookings = bRes?.data ?? []
  const payments = pRes?.data ?? []
  const customers = cRes?.data ?? []
  const hotels   = hRes?.data ?? []

  // Derive status breakdown for bookings
  const bookingByStatus = ['pending','confirmed','checked_in','checked_out','cancelled'].map(s => ({
    name: s, value: bookings.filter(b => b.status === s).length
  })).filter(d => d.value > 0)

  // Derive hotel status breakdown
  const hotelByStatus = ['approved','pending','rejected','suspended'].map(s => ({
    name: s, value: hotels.filter(h => h.status === s).length
  })).filter(d => d.value > 0)

  // Derive city distribution
  const cityMap = hotels.reduce((acc, h) => { if (h.city) acc[h.city] = (acc[h.city] || 0) + 1; return acc }, {})
  const cityData = Object.entries(cityMap).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count).slice(0, 8)

  const totalRevenue    = payments.filter(p => p.status === 'completed').reduce((s, p) => s + parseFloat(p.amount || 0), 0)
  const totalRefunded   = payments.filter(p => p.status === 'refunded').reduce((s, p) => s + parseFloat(p.amount || 0), 0)
  const totalCommission = totalRevenue * 0.1

  if (type === 'revenue') return (
    <div>
      <div className="page-header"><div><div className="page-title">Revenue Report</div><div className="page-subtitle">Revenue and commission analytics</div></div></div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{formatPrice(totalRevenue)}</div><div className="stat-label">Total Revenue</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalCommission)}</div><div className="stat-label">Platform Commission</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalRefunded)}</div><div className="stat-label">Total Refunded</div></div>
      </div>
      <div className="chart-card">
        <h3 style={{ marginBottom: 16 }}>Payment Status Breakdown</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={[
              { name: 'Completed', value: payments.filter(p => p.status === 'completed').length },
              { name: 'Pending',   value: payments.filter(p => p.status === 'pending').length },
              { name: 'Refunded',  value: payments.filter(p => p.status === 'refunded').length },
            ].filter(d => d.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  if (type === 'bookings') return (
    <div>
      <div className="page-header"><div><div className="page-title">Bookings Report</div><div className="page-subtitle">Booking trends and status breakdown</div></div></div>
      <div className="stat-grid-4">
        <div className="stat-card"><div className="stat-value">{stats?.totalBookings ?? bookings.length}</div><div className="stat-label">Total Bookings</div></div>
        <div className="stat-card"><div className="stat-value">{bookings.filter(b => b.status === 'confirmed').length}</div><div className="stat-label">Confirmed</div></div>
        <div className="stat-card"><div className="stat-value">{bookings.filter(b => b.status === 'checked_out').length}</div><div className="stat-label">Completed</div></div>
        <div className="stat-card"><div className="stat-value">{bookings.filter(b => b.status === 'cancelled').length}</div><div className="stat-label">Cancelled</div></div>
      </div>
      <div className="chart-card">
        <h3 style={{ marginBottom: 16 }}>Bookings by Status</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={bookingByStatus}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  if (type === 'hotels') return (
    <div>
      <div className="page-header"><div><div className="page-title">Hotels Report</div><div className="page-subtitle">Hotel distribution and status</div></div></div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{stats?.totalHotels ?? hotels.length}</div><div className="stat-label">Total Hotels</div></div>
        <div className="stat-card"><div className="stat-value">{hotels.filter(h => h.status === 'approved').length}</div><div className="stat-label">Approved</div></div>
        <div className="stat-card"><div className="stat-value">{hotels.filter(h => h.status === 'pending').length}</div><div className="stat-label">Pending Review</div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="chart-card">
          <h3 style={{ marginBottom: 16 }}>Hotels by City</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cityData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
              <YAxis dataKey="city" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#059669" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3 style={{ marginBottom: 16 }}>By Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={hotelByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {hotelByStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )

  if (type === 'customers') return (
    <div>
      <div className="page-header"><div><div className="page-title">Customers Report</div><div className="page-subtitle">User base overview</div></div></div>
      <div className="stat-grid-4">
        <div className="stat-card"><div className="stat-value">{stats?.totalCustomers ?? customers.length}</div><div className="stat-label">Total Customers</div></div>
        <div className="stat-card"><div className="stat-value">{customers.filter(c => c.is_active).length}</div><div className="stat-label">Active</div></div>
        <div className="stat-card"><div className="stat-value">{customers.filter(c => !c.is_active).length}</div><div className="stat-label">Suspended</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalRevenue / Math.max(customers.length, 1))}</div><div className="stat-label">Avg Revenue/Customer</div></div>
      </div>
      <div className="chart-card">
        <h3 style={{ marginBottom: 16 }}>Customer Status</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={[
              { name: 'Active',    value: customers.filter(c => c.is_active).length },
              { name: 'Suspended', value: customers.filter(c => !c.is_active).length },
            ].filter(d => d.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  return null
}
