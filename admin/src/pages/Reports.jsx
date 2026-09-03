import { useParams } from 'react-router-dom'
import { getStats, BOOKINGS, HOTELS, CUSTOMERS, HOTEL_OWNERS, PAYMENTS, COMMISSIONS } from '../lib/mockData'
import { formatPrice } from '../lib/format'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#0066ff', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#00bfa5']
const stats = getStats()

// --- Revenue ---
const monthlyRevenue = [
  { month: 'Mar', revenue: 42000 },
  { month: 'Apr', revenue: 67000 },
  { month: 'May', revenue: 89000 },
  { month: 'Jun', revenue: 74000 },
  { month: 'Jul', revenue: 112000 },
  { month: 'Aug', revenue: 127000 },
]

// --- Bookings ---
const bookingByStatus = [
  { name: 'Confirmed', value: stats.confirmedBookings },
  { name: 'Completed', value: stats.completedBookings },
  { name: 'Cancelled', value: stats.cancelledBookings },
  { name: 'Pending', value: BOOKINGS.filter(b => b.status === 'pending').length },
]
const monthlyBookings = [
  { month: 'Mar', bookings: 12 },
  { month: 'Apr', bookings: 19 },
  { month: 'May', bookings: 25 },
  { month: 'Jun', bookings: 22 },
  { month: 'Jul', bookings: 34 },
  { month: 'Aug', bookings: 38 },
]

// --- Hotels ---
const cityData = Object.entries(
  HOTELS.reduce((acc, h) => { acc[h.city] = (acc[h.city] || 0) + 1; return acc }, {})
).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count)

const starData = Object.entries(
  HOTELS.reduce((acc, h) => { acc[`${h.star_rating}★`] = (acc[`${h.star_rating}★`] || 0) + 1; return acc }, {})
).map(([name, value]) => ({ name, value }))

const hotelStatusData = [
  { name: 'Approved', value: stats.approvedHotels },
  { name: 'Pending', value: stats.pendingHotels },
  { name: 'Rejected', value: stats.rejectedHotels },
]

// --- Customers ---
const customerGrowth = [
  { month: 'Mar', users: 4 },
  { month: 'Apr', users: 6 },
  { month: 'May', users: 8 },
  { month: 'Jun', users: 5 },
  { month: 'Jul', users: 11 },
  { month: 'Aug', users: 9 },
]
const roleData = [
  { name: 'Customers', value: stats.customers },
  { name: 'Hotel Owners', value: stats.owners },
]
const totalSpend = PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)

export default function Reports() {
  const { type } = useParams()

  if (type === 'revenue') return (
    <div>
      <div className="page-header"><div><div className="page-title">Revenue Report</div><div className="page-subtitle">Revenue and commission analytics</div></div></div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{formatPrice(stats.totalRevenue)}</div><div className="stat-label">Total Revenue</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(stats.totalCommission)}</div><div className="stat-label">Total Commission</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(stats.pendingCommission)}</div><div className="stat-label">Pending Payout</div></div>
      </div>
      <div className="chart-card">
        <h3 style={{ marginBottom: 16 }}>Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyRevenue}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={v => formatPrice(v)} />
            <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )

  if (type === 'bookings') return (
    <div>
      <div className="page-header"><div><div className="page-title">Bookings Report</div><div className="page-subtitle">Booking trends and status</div></div></div>
      <div className="stat-grid-4">
        <div className="stat-card"><div className="stat-value">{stats.totalBookings}</div><div className="stat-label">Total Bookings</div></div>
        <div className="stat-card"><div className="stat-value">{stats.confirmedBookings}</div><div className="stat-label">Confirmed</div></div>
        <div className="stat-card"><div className="stat-value">{stats.completedBookings}</div><div className="stat-label">Completed</div></div>
        <div className="stat-card"><div className="stat-value">{stats.cancelledBookings}</div><div className="stat-label">Cancelled</div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        <div className="chart-card">
          <h3 style={{ marginBottom: 16 }}>Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyBookings}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Line dataKey="bookings" stroke="#0066ff" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3 style={{ marginBottom: 16 }}>By Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={bookingByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {bookingByStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )

  if (type === 'hotels') return (
    <div>
      <div className="page-header"><div><div className="page-title">Hotels Report</div><div className="page-subtitle">Hotel distribution and performance</div></div></div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{stats.totalHotels}</div><div className="stat-label">Total Hotels</div></div>
        <div className="stat-card"><div className="stat-value">{stats.approvedHotels}</div><div className="stat-label">Approved</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(Math.round(HOTELS.reduce((s, h) => s + h.price_from, 0) / HOTELS.length))}</div><div className="stat-label">Avg Price/Night</div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div className="chart-card">
          <h3 style={{ marginBottom: 16 }}>Hotels by City</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cityData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
              <YAxis dataKey="city" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#0066ff" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3 style={{ marginBottom: 16 }}>By Star Rating</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={starData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {starData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )

  if (type === 'customers') return (
    <div>
      <div className="page-header"><div><div className="page-title">Customers Report</div><div className="page-subtitle">User growth and spending</div></div></div>
      <div className="stat-grid-4">
        <div className="stat-card"><div className="stat-value">{stats.totalUsers}</div><div className="stat-label">Total Users</div></div>
        <div className="stat-card"><div className="stat-value">{stats.customers}</div><div className="stat-label">Customers</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(totalSpend)}</div><div className="stat-label">Total Spend</div></div>
        <div className="stat-card"><div className="stat-value">{formatPrice(Math.round(totalSpend / Math.max(stats.customers, 1)))}</div><div className="stat-label">Avg Spend/Customer</div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div className="chart-card">
          <h3 style={{ marginBottom: 16 }}>User Growth</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={customerGrowth}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Line dataKey="users" stroke="#0066ff" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3 style={{ marginBottom: 16 }}>By Role</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {roleData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )

  return null
}
