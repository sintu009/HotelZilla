import { useState } from 'react'
import { getDashboardStats, BOOKINGS, HOTELS, EARNINGS } from '../lib/mockData'
import { formatPrice, formatDate } from '../lib/format'
import { Building2, CalendarClock, Wallet, Star, TrendingUp, BedDouble } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts'

const stats = getDashboardStats()
const COLORS = ['#1a9981', '#0ea5e9', '#f59e0b', '#ef4444']

const bookingStatusData = [
  { name: 'Confirmed', value: stats.activeBookings },
  { name: 'Completed', value: stats.completedBookings },
  { name: 'Cancelled', value: stats.cancelledBookings },
]

const recentBookings = BOOKINGS.slice(0, 5)

export default function Dashboard() {
  const topStats = [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: Wallet, color: '#1a9981', bg: '#d1fae5' },
    { label: 'Active Bookings', value: stats.activeBookings, icon: CalendarClock, color: '#0ea5e9', bg: '#e0f2fe' },
    { label: 'My Hotels', value: stats.totalHotels, icon: Building2, color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Avg Rating', value: `${stats.avgRating} ★`, icon: Star, color: '#8b5cf6', bg: '#ede9fe' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Welcome back, Ravi!</div>
          <div className="page-subtitle">Here's what's happening with your properties</div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        {topStats.map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}><Icon size={20} /></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* Secondary stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}><TrendingUp size={20} /></div>
          <div className="stat-value">{formatPrice(stats.totalPayout)}</div>
          <div className="stat-label">Net Payout Earned</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}><BedDouble size={20} /></div>
          <div className="stat-value">{stats.activeRooms}</div>
          <div className="stat-label">Active Room Types</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5', color: '#065f46' }}><CalendarClock size={20} /></div>
          <div className="stat-value">{stats.completedBookings}</div>
          <div className="stat-label">Completed Stays</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ede9fe', color: '#6d28d9' }}><Star size={20} /></div>
          <div className="stat-value">{stats.totalReviews}</div>
          <div className="stat-label">Total Reviews</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-title">Revenue & Payouts — Last 6 Months</div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={EARNINGS.last_6_months}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a9981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#1a9981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pay" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v / 1000}k`} />
              <Tooltip formatter={v => formatPrice(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#1a9981" strokeWidth={2} fill="url(#rev)" name="Revenue" />
              <Area type="monotone" dataKey="payout" stroke="#0ea5e9" strokeWidth={2} fill="url(#pay)" name="Payout" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-card-title">Bookings by Status</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={bookingStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {bookingStatusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="card">
        <div className="card-header">
          <h3>Recent Bookings</h3>
          <a href="/dashboard/bookings" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>View all →</a>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Reference</th><th>Hotel</th><th>Guest</th><th>Check-in</th><th>Amount</th><th>Payout</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recentBookings.map(b => (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{b.booking_reference}</td>
                  <td style={{ fontWeight: 600 }}>{b.hotel_name}</td>
                  <td>{b.guest_name}</td>
                  <td>{formatDate(b.check_in)}</td>
                  <td style={{ fontWeight: 600 }}>{formatPrice(b.total_amount)}</td>
                  <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{formatPrice(b.payout)}</td>
                  <td>
                    <span className={`badge ${b.status === 'confirmed' ? 'badge-success' : b.status === 'completed' ? 'badge-info' : 'badge-error'}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
