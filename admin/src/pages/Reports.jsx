import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatPrice, formatDate } from '../lib/format'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

export default function Reports() {
  const { type } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      if (type === 'revenue') {
        const { data: payments } = await supabase.from('payments').select('amount, payment_date, status').eq('status', 'paid').order('payment_date')
        const { data: commissions } = await supabase.from('commissions').select('commission_amount, payout_status')
        const monthly = {}
        ;(payments || []).forEach(p => {
          const m = new Date(p.payment_date).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
          monthly[m] = (monthly[m] || 0) + Number(p.amount)
        })
        setData({
          chartData: Object.entries(monthly).map(([month, amount]) => ({ month, revenue: amount })),
          totalRevenue: (payments || []).reduce((s, p) => s + Number(p.amount), 0),
          totalCommission: (commissions || []).reduce((s, c) => s + Number(c.commission_amount), 0),
          pendingCommission: (commissions || []).filter(c => c.payout_status === 'pending').reduce((s, c) => s + Number(c.commission_amount), 0),
        })
      } else if (type === 'bookings') {
        const { data: bookings } = await supabase.from('bookings').select('status, created_at, total_amount')
        const byStatus = {}
        ;(bookings || []).forEach(b => { byStatus[b.status] = (byStatus[b.status] || 0) + 1 })
        const monthly = {}
        ;(bookings || []).forEach(b => {
          const m = new Date(b.created_at).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
          monthly[m] = (monthly[m] || 0) + 1
        })
        setData({
          statusData: Object.entries(byStatus).map(([name, value]) => ({ name, value })),
          chartData: Object.entries(monthly).map(([month, bookings]) => ({ month, bookings })),
          total: bookings.length,
          confirmed: bookings.filter(b => b.status === 'confirmed').length,
          cancelled: bookings.filter(b => b.status === 'cancelled').length,
          completed: bookings.filter(b => b.status === 'completed').length,
        })
      } else if (type === 'hotels') {
        const { data: hotels } = await supabase.from('hotels').select('status, city, star_rating, price_from')
        const byCity = {}
        ;(hotels || []).forEach(h => { byCity[h.city] = (byCity[h.city] || 0) + 1 })
        const byStatus = { approved: 0, pending: 0, rejected: 0 }
        ;(hotels || []).forEach(h => { byStatus[h.status] = (byStatus[h.status] || 0) + 1 })
        const byStar = {}
        ;(hotels || []).forEach(h => { byStar[`${h.star_rating}★`] = (byStar[`${h.star_rating}★`] || 0) + 1 })
        setData({
          cityData: Object.entries(byCity).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count).slice(0, 8),
          statusData: Object.entries(byStatus).map(([name, value]) => ({ name, value })),
          starData: Object.entries(byStar).map(([name, value]) => ({ name, value })),
          total: hotels.length,
          avgPrice: hotels.length > 0 ? Math.round(hotels.reduce((s, h) => s + Number(h.price_from), 0) / hotels.length) : 0,
        })
      } else if (type === 'customers') {
        const { data: profiles } = await supabase.from('profiles').select('role, status, created_at')
        const { data: bookings } = await supabase.from('bookings').select('customer_id, total_amount')
        const byRole = {}
        ;(profiles || []).forEach(p => { byRole[p.role] = (byRole[p.role] || 0) + 1 })
        const monthly = {}
        ;(profiles || []).forEach(p => {
          const m = new Date(p.created_at).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
          monthly[m] = (monthly[m] || 0) + 1
        })
        const spendByUser = {}
        ;(bookings || []).forEach(b => { spendByUser[b.customer_id] = (spendByUser[b.customer_id] || 0) + Number(b.total_amount) })
        const totalSpend = Object.values(spendByUser).reduce((s, v) => s + v, 0)
        setData({
          roleData: Object.entries(byRole).map(([name, value]) => ({ name, value })),
          chartData: Object.entries(monthly).map(([month, users]) => ({ month, users })),
          total: profiles.length,
          active: profiles.filter(p => p.status === 'active').length,
          suspended: profiles.filter(p => p.status === 'suspended').length,
          totalSpend,
          avgSpend: Object.keys(spendByUser).length > 0 ? Math.round(totalSpend / Object.keys(spendByUser).length) : 0,
        })
      }
      setLoading(false)
    }
    load()
  }, [type])

  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!data) return null

  const COLORS = ['#0066ff', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

  if (type === 'revenue') {
    return (
      <div>
        <div className="page-header"><div><div className="page-title">Revenue Report</div><div className="page-subtitle">Revenue and commission analytics</div></div></div>
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
          <div className="stat-card"><div className="stat-value">{formatPrice(data.totalRevenue)}</div><div className="stat-label">Total Revenue</div></div>
          <div className="stat-card"><div className="stat-value">{formatPrice(data.totalCommission)}</div><div className="stat-label">Total Commission</div></div>
          <div className="stat-card"><div className="stat-value">{formatPrice(data.pendingCommission)}</div><div className="stat-label">Pending Payout</div></div>
        </div>
        <div className="chart-card">
          <h3 style={{ marginBottom: 16 }}>Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.chartData}><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  if (type === 'bookings') {
    return (
      <div>
        <div className="page-header"><div><div className="page-title">Bookings Report</div><div className="page-subtitle">Booking trends and status</div></div></div>
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
          <div className="stat-card"><div className="stat-value">{data.total}</div><div className="stat-label">Total Bookings</div></div>
          <div className="stat-card"><div className="stat-value">{data.confirmed}</div><div className="stat-label">Confirmed</div></div>
          <div className="stat-card"><div className="stat-value">{data.completed}</div><div className="stat-label">Completed</div></div>
          <div className="stat-card"><div className="stat-value">{data.cancelled}</div><div className="stat-label">Cancelled</div></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
          <div className="chart-card">
            <h3 style={{ marginBottom: 16 }}>Monthly Bookings</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.chartData}><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} allowDecimals={false} /><Tooltip /><Line dataKey="bookings" stroke="#0066ff" strokeWidth={2} dot={{ r: 4 }} /></LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3 style={{ marginBottom: 16 }}>By Status</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart><Pie data={data.statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{data.statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Legend /></PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'hotels') {
    return (
      <div>
        <div className="page-header"><div><div className="page-title">Hotels Report</div><div className="page-subtitle">Hotel distribution and performance</div></div></div>
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
          <div className="stat-card"><div className="stat-value">{data.total}</div><div className="stat-label">Total Hotels</div></div>
          <div className="stat-card"><div className="stat-value">{formatPrice(data.avgPrice)}</div><div className="stat-label">Avg Price/Night</div></div>
          <div className="stat-card"><div className="stat-value">{data.statusData.find(s => s.name === 'approved')?.value || 0}</div><div className="stat-label">Approved</div></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <div className="chart-card">
            <h3 style={{ marginBottom: 16 }}>Hotels by City</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.cityData} layout="vertical"><XAxis type="number" tick={{ fontSize: 12 }} /><YAxis dataKey="city" type="category" tick={{ fontSize: 12 }} width={80} /><Tooltip /><Bar dataKey="count" fill="#0066ff" radius={[0, 4, 4, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3 style={{ marginBottom: 16 }}>By Star Rating</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart><Pie data={data.starData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{data.starData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Legend /></PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'customers') {
    return (
      <div>
        <div className="page-header"><div><div className="page-title">Customers Report</div><div className="page-subtitle">User growth and spending</div></div></div>
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
          <div className="stat-card"><div className="stat-value">{data.total}</div><div className="stat-label">Total Users</div></div>
          <div className="stat-card"><div className="stat-value">{data.active}</div><div className="stat-label">Active</div></div>
          <div className="stat-card"><div className="stat-value">{formatPrice(data.totalSpend)}</div><div className="stat-label">Total Spend</div></div>
          <div className="stat-card"><div className="stat-value">{formatPrice(data.avgSpend)}</div><div className="stat-label">Avg Spend/User</div></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
          <div className="chart-card">
            <h3 style={{ marginBottom: 16 }}>User Growth</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.chartData}><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} allowDecimals={false} /><Tooltip /><Line dataKey="users" stroke="#0066ff" strokeWidth={2} dot={{ r: 4 }} /></LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3 style={{ marginBottom: 16 }}>By Role</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart><Pie data={data.roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{data.roleData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Legend /></PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    )
  }

  return null
}
