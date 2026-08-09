// White-label theme definitions.
// Currently 2 themes; designed to expand to 5+ later.

export const THEMES = {
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    colors: {
      primary: '#1a9981',
      primaryDark: '#0d6e5a',
      primaryLight: '#d1fae5',
      sidebar: '#0d1f1a',
      sidebarHover: 'rgba(26,153,129,0.12)',
      sidebarActive: 'rgba(26,153,129,0.2)',
      sidebarActiveText: '#4ade80',
      sidebarBorder: 'rgba(26,153,129,0.12)',
      brandGradient: 'linear-gradient(135deg, #1a9981, #0d6e5a)',
      badgeInfoBg: '#d1fae5',
      badgeInfoColor: '#065f46',
      badgeInfoBorder: 'rgba(26,153,129,0.3)',
      topbarBadgeBg: '#d1fae5',
      topbarBadgeColor: '#0d6e5a',
      topbarBadgeBorder: 'rgba(26,153,129,0.3)',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    colors: {
      primary: '#0284c7',
      primaryDark: '#0369a1',
      primaryLight: '#e0f2fe',
      sidebar: '#0c1a2e',
      sidebarHover: 'rgba(2,132,199,0.12)',
      sidebarActive: 'rgba(2,132,199,0.2)',
      sidebarActiveText: '#7dd3fc',
      sidebarBorder: 'rgba(2,132,199,0.12)',
      brandGradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
      badgeInfoBg: '#e0f2fe',
      badgeInfoColor: '#0369a1',
      badgeInfoBorder: 'rgba(2,132,199,0.3)',
      topbarBadgeBg: '#e0f2fe',
      topbarBadgeColor: '#0369a1',
      topbarBadgeBorder: 'rgba(2,132,199,0.3)',
    },
  },
}

// Default white-label config for the current partner.
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

export function applyTheme(themeId) {
  const theme = THEMES[themeId] || THEMES.emerald
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
}
