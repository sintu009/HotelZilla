import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'success', onClose, duration = 2500 }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(t)
  }, [duration, onClose])

  if (!visible) return null

  return (
    <div className={`toast ${type}`}>
      {message}
    </div>
  )
}
