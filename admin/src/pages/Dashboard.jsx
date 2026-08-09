import { useState } from 'react'
import { getStats, BOOKINGS, HOTELS } from '../lib/mockData'
import { formatPrice } from '../lib/format'
import { Building2, Users, CalendarClock, DollarSign, TrendingUp, Star, Ticket, Percent } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const stats = getStats()

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const bookingChart = WEEK_DAYS.map((d, i) => ({ date: d, bookings: [3, 6, 4, 8, 5, 9, 7][i] }))
const hotelStatusData = [
  { name: 'Approved', value: stats.approvedHotels, color: '#22c55e' },
  { name: 'Pending',  value: stats.pendingHotels,  color: '#f59e0b' },
  { name: 'Rejected', value: stats.rejectedHotels, color: '#ef4444' },
]
const recentBookings = BOOKINGS.slice(0, 5)

export default function Dashboard() {
  const topStats = [
    { label: 'Total Revenue',  value: formatPrice(stats.totalRevenue),  icon: DollarSign,    color: '#22c55e', bg: '#dcfce7' },
    { label: 'Total Bookings', value: stats.totalBookings,              icon: CalendarClock, color: '#0066ff', bg: '#e6f0ff' },
    { label: 'Hotels',         value: stats.totalHotels,                icon: Building2,     color: '#ff6b35', bg: '#ffedd5' },
    { label: 'Total Users',    value: stats.totalUsers,                 icon: Users,         color: '#8b5cf6', bg: '#ede9fe' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Platform overview and key metrics</div>
        </div>
      </div>

      {/* Row 1 */}
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

      {/* Row 2 */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}><TrendingUp size={20} /></div>
          <div className="stat-value">{formatPrice(stats.totalCommission)}</div>
          <div className="stat-label">Total Commission</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}><Star size={20} /></div>
          <div className="stat-value">{stats.avgRating}</div>
          <div className="stat-label">Avg Rating</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7', color: '#15803d' }}><Ticket size={20} /></div>
          <div className="stat-value">{stats.activeOffers}</div>
          <div className="stat-label">Active Offers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2', color: '#b91c1c' }}><Percent size={20} /></div>
          <div className="stat-value">{stats.couponUsage}</div>
          <div className="stat-label">Coupon Uses</div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        <div className="chart-card">
          <h3 style={{ marginBottom: 16 }}>Bookings — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bookingChart}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#0066ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3 style={{ marginBottom: 16 }}>Hotel Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={hotelStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {hotelStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="card">
        <div className="card-header"><h3>Recent Bookings</h3></div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Reference</th><th>Hotel</th><th>Guest</th><th>Amount</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {recentBookings.map(b => (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{b.booking_reference}</td>
                  <td>{b.hotel_name}</td>
                  <td>{b.guest_name}</td>
                  <td style={{ fontWeight: 600 }}>{formatPrice(b.total_amount)}</td>
                  <td><span className={`badge ${b.status === 'confirmed' ? 'badge-success' : b.status === 'completed' ? 'badge-info' : b.status === 'cancelled' ? 'badge-error' : 'badge-warning'}`}>{b.status}</span></td>
                  <td>{new Date(b.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
