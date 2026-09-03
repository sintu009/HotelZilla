import { useEffect } from 'react'
import { AlertTriangle, Trash2, HelpCircle } from 'lucide-react'

const VARIANTS = {
  danger:  { icon: Trash2,        iconBg: '#fee2e2', iconColor: '#ef4444', confirmCls: 'btn-danger' },
  warning: { icon: AlertTriangle, iconBg: '#fef3c7', iconColor: '#f59e0b', confirmCls: 'btn-warning' },
  info:    { icon: HelpCircle,    iconBg: '#eef2ff', iconColor: '#6366f1', confirmCls: 'btn-primary' },
}

export default function ConfirmModal({ open, onClose, onConfirm, variant = 'danger', title = 'Are you sure?', message, confirmLabel = 'Confirm', cancelLabel = 'Cancel' }) {
  const v = VARIANTS[variant] || VARIANTS.danger
  const Icon = v.icon

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-overlay confirm-overlay" onClick={onClose}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon-wrap" style={{ background: v.iconBg }}>
          <Icon size={22} color={v.iconColor} />
        </div>
        <div className="confirm-content">
          <div className="confirm-title">{title}</div>
          {message && <div className="confirm-message">{message}</div>}
        </div>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onClose}>{cancelLabel}</button>
          <button className={`btn ${v.confirmCls}`} onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
