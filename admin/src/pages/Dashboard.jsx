import { getStats, BOOKINGS } from '../lib/mockData'
import { formatPrice } from '../lib/format'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts'

const stats = getStats()

const bookingChart = [
  { day: 'Mon', bookings: 6 },
  { day: 'Tue', bookings: 4 },
  { day: 'Wed', bookings: 8 },
  { day: 'Thu', bookings: 5 },
  { day: 'Fri', bookings: 9 },
  { day: 'Sat', bookings: 7 },
  { day: 'Sun', bookings: 3 },
]

const hotelStatusData = [
  { name: 'Approved', value: stats.approvedHotels, color: '#1a9981' },
  { name: 'Pending',  value: stats.pendingHotels,  color: '#f59e0b' },
  { name: 'Rejected', value: stats.rejectedHotels, color: '#ef4444' },
]

const recentBookings = BOOKINGS.slice(0, 5)

const STATUS_BADGE = {
  confirmed: 'badge-success',
  completed: 'badge-info',
  cancelled:  'badge-error',
  pending:    'badge-warning',
}

const STAT_CARDS = [
  { label: 'Total Revenue',    value: formatPrice(stats.totalRevenue) },
  { label: 'Total Bookings',   value: stats.totalBookings },
  { label: 'Total Hotels',     value: stats.totalHotels },
  { label: 'Total Users',      value: stats.totalUsers },
  { label: 'Commission',       value: formatPrice(stats.totalCommission) },
  { label: 'Avg Rating',       value: stats.avgRating },
  { label: 'Active Offers',    value: stats.activeOffers },
  { label: 'Coupon Uses',      value: stats.couponUsage },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 14px', fontSize: '0.82rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 700, marginBottom: 2, color: '#0f172a' }}>{label}</div>
      <div style={{ color: '#1a9981' }}>{payload[0].value} bookings</div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Platform overview and key metrics</div>
        </div>
      </div>

      {/* Stat cards — 4 per row */}
      <div className="dash-stat-grid">
        {STAT_CARDS.map(s => (
          <div key={s.label} className="dash-stat-card">
            <div className="dash-stat-value">{s.value}</div>
            <div className="dash-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-title">Bookings — Last 7 Days</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={bookingChart} barSize={32} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(26,153,129,0.06)' }} />
              <Bar dataKey="bookings" fill="#1a9981" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card-title">Hotel Status</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={hotelStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {hotelStatusData.map((e, i) => (
                  <Cell key={i} fill={e.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value, name]}
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.82rem' }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="card">
        <div className="card-header">
          <h3>Recent Bookings</h3>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Hotel</th>
                <th>Guest</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(b => (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748b' }}>{b.booking_reference}</td>
                  <td style={{ fontWeight: 600 }}>{b.hotel_name}</td>
                  <td>{b.guest_name}</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{formatPrice(b.total_amount)}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[b.status] || 'badge-neutral'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ color: '#64748b' }}>{new Date(b.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
