import { useFetch } from '../lib/useFetch'
import { dashboardApi, bookingsApi } from '../lib/api'
import { formatPrice, formatDate } from '../lib/format'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts'

const STATUS_BADGE = {
  confirmed:   'badge-success',
  completed:   'badge-info',
  checked_out: 'badge-info',
  cancelled:   'badge-error',
  pending:     'badge-warning',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 14px', fontSize: '0.82rem' }}>
      <div style={{ fontWeight: 700, color: '#0f172a' }}>{label}</div>
      <div style={{ color: '#1a9981' }}>{payload[0].value} bookings</div>
    </div>
  )
}

export default function Dashboard() {
  const { data: stats, loading: sl } = useFetch(() => dashboardApi.stats())
  const { data: bookingsRes, loading: bl } = useFetch(() => bookingsApi.list(1, 5))
  const { data: weeklyData } = useFetch(() => dashboardApi.weeklyBookings())

  const recentBookings = bookingsRes?.data ?? []
  const weeklyChartData = weeklyData ?? []

  const hotelStatusData = stats ? [
    { name: 'Approved', value: parseInt(stats.totalHotels) || 0, color: '#1a9981' },
    { name: 'Pending',  value: 0, color: '#f59e0b' },
    { name: 'Rejected', value: 0, color: '#ef4444' },
  ] : []

  const STAT_CARDS = stats ? [
    { label: 'Total Revenue',  value: formatPrice(stats.totalRevenue) },
    { label: 'Total Bookings', value: stats.totalBookings },
    { label: 'Total Hotels',   value: stats.totalHotels },
    { label: 'Total Customers',value: stats.totalCustomers },
  ] : []

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Platform overview and key metrics</div>
        </div>
      </div>

      {sl
        ? <div className="loading-center"><span className="spinner" /></div>
        : (
          <div className="dash-stat-grid">
            {STAT_CARDS.map(s => (
              <div key={s.label} className="dash-stat-card">
                <div className="dash-stat-value">{s.value}</div>
                <div className="dash-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )
      }

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-title">Bookings — Last 7 Days</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyChartData} barSize={32} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(26,153,129,0.06)' }} />
              <Bar dataKey="bookings" fill="#1a9981" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card-title">Hotel Status</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={hotelStatusData} dataKey="value" nameKey="name" cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {hotelStatusData.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.82rem' }} />
              <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Recent Bookings</h3></div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Hotel</th><th>Guest</th><th>Amount</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {bl
                ? <tr><td colSpan={6} style={{ textAlign: 'center' }}><span className="spinner" /></td></tr>
                : recentBookings.length === 0
                  ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings yet</td></tr>
                  : recentBookings.map(b => (
                    <tr key={b.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#64748b' }}>#{b.id}</td>
                      <td style={{ fontWeight: 600 }}>{b.hotel_name}</td>
                      <td>{b.customer_name}</td>
                      <td style={{ fontWeight: 700 }}>{formatPrice(b.amount)}</td>
                      <td><span className={`badge ${STATUS_BADGE[b.status] || 'badge-neutral'}`}>{b.status}</span></td>
                      <td style={{ color: '#64748b' }}>{formatDate(b.created_at)}</td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
