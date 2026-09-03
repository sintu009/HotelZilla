import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const ToastCtx = createContext(null)

const ICONS = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info }
const COLORS = {
  success: { bar: '#10b981', icon: '#10b981', bg: '#f0fdf4', border: '#bbf7d0', text: '#064e3b' },
  error:   { bar: '#ef4444', icon: '#ef4444', bg: '#fef2f2', border: '#fecaca', text: '#7f1d1d' },
  warning: { bar: '#f59e0b', icon: '#f59e0b', bg: '#fffbeb', border: '#fde68a', text: '#78350f' },
  info:    { bar: '#6366f1', icon: '#6366f1', bg: '#eef2ff', border: '#c7d2fe', text: '#312e81' },
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
        {toast.title && <div style={{ fontSize: '0.83rem', fontWeight: 700, color: c.text, lineHeight: 1.3 }}>{toast.title}</div>}
        {toast.message && <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>{toast.message}</div>}
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
