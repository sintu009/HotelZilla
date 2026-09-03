import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const ToastCtx = createContext(null)

const ICONS = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info }
const COLORS = {
  success: { bar: '#22C55E', icon: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', text: '#14532D' },
  error:   { bar: '#EF4444', icon: '#DC2626', bg: '#FEF2F2', border: '#FECACA', text: '#7F1D1D' },
  warning: { bar: '#EAB308', icon: '#CA8A04', bg: '#FEFCE8', border: '#FEF08A', text: '#713F12' },
  info:    { bar: '#0EA5E9', icon: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', text: '#0C4A6E' },
}
const DURATION = 4000

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const timerRef = useRef(null)
  const c = COLORS[toast.type]
  const Icon = ICONS[toast.type]

  const dismiss = useCallback(() => {
    setLeaving(true)
    setTimeout(() => onRemove(toast.id), 320)
  }, [toast.id, onRemove])

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    timerRef.current = setTimeout(dismiss, DURATION)
    return () => clearTimeout(timerRef.current)
  }, [dismiss])

  return (
    <div
      className={`fe-toast-item${visible ? ' in' : ''}${leaving ? ' out' : ''}`}
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
      onMouseEnter={() => clearTimeout(timerRef.current)}
      onMouseLeave={() => { timerRef.current = setTimeout(dismiss, 1200) }}
    >
      <div className="fe-toast-bar" style={{ background: c.bar }} />
      <div style={{ color: c.icon, flexShrink: 0, marginTop: 1 }}><Icon size={17} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && <div style={{ fontFamily: 'var(--heading)', fontSize: '13px', fontWeight: 700, color: c.text, lineHeight: 1.3 }}>{toast.title}</div>}
        {toast.message && <div style={{ fontFamily: 'var(--sans)', fontSize: '12px', color: '#64748B', marginTop: 2 }}>{toast.message}</div>}
      </div>
      <button className="fe-toast-close" onClick={dismiss}><X size={14} /></button>
      <div className="fe-toast-progress" style={{ background: c.bar, animationDuration: `${DURATION}ms` }} />
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const toast = useCallback((type, title, message) => {
    const id = Date.now() + Math.random()
    setToasts(p => [...p, { id, type, title, message }])
  }, [])
  const remove = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), [])
  const api = {
    success: (title, message) => toast('success', title, message),
    error:   (title, message) => toast('error',   title, message),
    warning: (title, message) => toast('warning', title, message),
    info:    (title, message) => toast('info',    title, message),
  }
  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fe-toast-stack">
        {toasts.map(t => <ToastItem key={t.id} toast={t} onRemove={remove} />)}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx)
