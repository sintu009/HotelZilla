import { EARNINGS } from '../lib/mockData'
import { formatPrice, formatDate } from '../lib/format'
import { Wallet, TrendingUp, Clock, CircleCheck as CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Earnings() {
  const topStats = [
    { label: 'Total Revenue', value: formatPrice(EARNINGS.total_revenue), icon: Wallet, color: '#1a9981', bg: '#d1fae5' },
    { label: 'Net Payout', value: formatPrice(EARNINGS.net_payout), icon: TrendingUp, color: '#0ea5e9', bg: '#e0f2fe' },
    { label: 'Paid Out', value: formatPrice(EARNINGS.paid_out), icon: CheckCircle, color: '#22c55e', bg: '#d1fae5' },
    { label: 'Pending Payout', value: formatPrice(EARNINGS.pending_payout), icon: Clock, color: '#f59e0b', bg: '#fef3c7' },
  ]

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Earnings & Payouts</div><div className="page-subtitle">Track your revenue and payout history</div></div>
      </div>

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

      {/* This month summary */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>This Month (August 2026)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Gross Revenue</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{formatPrice(EARNINGS.this_month_revenue)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Platform Commission</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--error)' }}>-{formatPrice(EARNINGS.this_month_commission)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Net Payout</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(EARNINGS.this_month_payout)}</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-card" style={{ marginBottom: 24 }}>
        <div className="chart-card-title">Monthly Revenue vs Payout</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={EARNINGS.last_6_months}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v / 1000}k`} />
            <Tooltip formatter={v => formatPrice(v)} />
            <Bar dataKey="revenue" fill="#1a9981" radius={[4, 4, 0, 0]} name="Revenue" />
            <Bar dataKey="payout" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Payout" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payout history */}
      <div className="card">
        <div className="card-header"><h3>Payout History</h3></div>
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Period</th><th>Transactions</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {EARNINGS.recent_payouts.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.period}</td>
                  <td>{p.transactions}</td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(p.amount)}</td>
                  <td><span className={`badge ${p.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{p.status}</span></td>
                  <td>{p.date ? formatDate(p.date) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
