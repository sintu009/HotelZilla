import { THEMES } from './themes'

// White-label config for the current partner.
// Admin would set this per-partner; for now it's mock data.
export const WHITE_LABEL = {
  partner_id: 'o1',
  brand_name: 'Grand Palace',
  brand_tagline: 'Partner Portal',
  logo_text: 'GP',
  logo_url: '',
  theme: 'emerald',
  portal_access: true,
  landing_page_enabled: false,
  landing_page_theme: 'emerald',
  custom_domain: '',
  support_email: 'ravi@example.com',
  support_phone: '+91 9876543210',
}

export function applyWhiteLabel(config) {
  const theme = THEMES[config.theme] || THEMES.emerald
  const root = document.documentElement
  const c = theme.colors

  root.style.setProperty('--primary', c.primary)
  root.style.setProperty('--primary-dark', c.primaryDark)
  root.style.setProperty('--primary-light', c.primaryLight)
  root.style.setProperty('--sidebar', c.sidebar)
  root.style.setProperty('--sidebar-hover', c.sidebarHover)
  root.style.setProperty('--sidebar-active', c.sidebarActive)
  root.style.setProperty('--sidebar-active-text', c.sidebarActiveText)
  root.style.setProperty('--sidebar-border', c.sidebarBorder)
  root.style.setProperty('--brand-gradient', c.brandGradient)
  root.style.setProperty('--badge-info-bg', c.badgeInfoBg)
  root.style.setProperty('--badge-info-color', c.badgeInfoColor)
  root.style.setProperty('--badge-info-border', c.badgeInfoBorder)
  root.style.setProperty('--topbar-badge-bg', c.topbarBadgeBg)
  root.style.setProperty('--topbar-badge-color', c.topbarBadgeColor)
  root.style.setProperty('--topbar-badge-border', c.topbarBadgeBorder)

  document.title = `${config.brand_name} — ${config.brand_tagline}`
}
