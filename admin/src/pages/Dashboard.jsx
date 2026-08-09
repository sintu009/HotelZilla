import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/format'
import { Building2, Users, CalendarClock, DollarSign, TrendingUp, Star, Ticket, Percent } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [chartData, setChartData] = useState([])
  const [hotelStatusData, setHotelStatusData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [hotels, pendingHotels, users, customers, owners, bookings, payments, reviews, offers, coupons, commissions] = await Promise.all([
        supabase.from('hotels').select('id, status'),
        supabase.from('hotels').select('id').eq('status', 'pending'),
        supabase.from('profiles').select('id, role'),
        supabase.from('profiles').select('id').eq('role', 'customer'),
        supabase.from('profiles').select('id').eq('role', 'hotel_owner'),
        supabase.from('bookings').select('id, total_amount, status, created_at'),
        supabase.from('payments').select('amount, status').eq('status', 'paid'),
        supabase.from('reviews').select('id, rating'),
        supabase.from('offers').select('id').eq('is_active', true),
        supabase.from('coupons').select('id, used_count').eq('is_active', true),
        supabase.from('commissions').select('commission_amount, payout_status'),
      ])

      const totalRevenue = (payments.data || []).reduce((s, p) => s + Number(p.amount), 0)
      const totalCommission = (commissions.data || []).reduce((s, c) => s + Number(c.commission_amount), 0)
      const avgRating = reviews.data?.length > 0 ? (reviews.data.reduce((s, r) => s + r.rating, 0) / reviews.data.length).toFixed(1) : '—'
      const couponUsage = (coupons.data || []).reduce((s, c) => s + (c.used_count || 0), 0)

      setStats({
        totalHotels: hotels.data?.length || 0,
        pendingHotels: pendingHotels.data?.length || 0,
        totalUsers: users.data?.length || 0,
        customers: customers.data?.length || 0,
        owners: owners.data?.length || 0,
        totalBookings: bookings.data?.length || 0,
        totalRevenue,
        totalCommission,
        avgRating,
        activeOffers: offers.data?.length || 0,
        couponUsage,
      })

      setRecentBookings((bookings.data || []).slice(0, 5))

      const hotelStatuses = hotels.data || []
      const statusCounts = { approved: 0, pending: 0, rejected: 0 }
      hotelStatuses.forEach(h => { statusCounts[h.status] = (statusCounts[h.status] || 0) + 1 })
      setHotelStatusData([
        { name: 'Approved', value: statusCounts.approved, color: '#22c55e' },
        { name: 'Pending', value: statusCounts.pending, color: '#f59e0b' },
        { name: 'Rejected', value: statusCounts.rejected, color: '#ef4444' },
      ])

      const last7 = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i)
        const ds = d.toISOString().split('T')[0]
        const count = (bookings.data || []).filter(b => b.created_at?.split('T')[0] === ds).length
        last7.push({ date: d.toLocaleDateString('en-IN', { weekday: 'short' }), bookings: count })
      }
      setChartData(last7)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: '#22c55e', bg: '#dcfce7' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: CalendarClock, color: '#0066ff', bg: '#e6f0ff' },
    { label: 'Hotels', value: stats.totalHotels, icon: Building2, color: '#ff6b35', bg: '#ffedd5' },
    { label: 'Users', value: stats.totalUsers, icon: Users, color: '#8b5cf6', bg: '#ede9fe' },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Platform overview and key metrics</div>
        </div>
      </div>

      <div className="stat-grid">
        {statCards.map(s => {
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

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        <div className="chart-card">
          <h3 style={{ marginBottom: 16 }}>Bookings - Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
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

      <div className="card">
        <div className="card-header"><h3>Recent Bookings</h3></div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr><th>Ref</th><th>Amount</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings yet</td></tr>
              ) : recentBookings.map(b => (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{b.id.slice(0, 8)}</td>
                  <td>{formatPrice(b.total_amount)}</td>
                  <td><span className={`badge ${b.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>{b.status}</span></td>
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
