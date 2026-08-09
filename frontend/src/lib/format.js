export function formatPrice(amount, symbol = '₹') {
  if (amount == null || isNaN(amount)) return `${symbol}0`
  return `${symbol}${Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 1
  const diff = new Date(checkOut) - new Date(checkIn)
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)))
}
