import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import { AuthProvider } from './lib/auth'
import Header from './components/Header'
import Footer from './components/Footer'
import client from './api/client'

const Landing           = lazy(() => import('./pages/Landing'))
const HotelListing      = lazy(() => import('./pages/HotelListing'))
const HotelDetail       = lazy(() => import('./pages/HotelDetail'))
const Booking           = lazy(() => import('./pages/Booking'))
const Login             = lazy(() => import('./pages/Login'))
const SignUp            = lazy(() => import('./pages/SignUp'))
const Offers            = lazy(() => import('./pages/Offers'))
const MyBookings        = lazy(() => import('./pages/MyBookings'))
const About             = lazy(() => import('./pages/About'))
const Careers           = lazy(() => import('./pages/Careers'))
const Press             = lazy(() => import('./pages/Press'))
const Blog              = lazy(() => import('./pages/Blog'))
const HelpCenter        = lazy(() => import('./pages/HelpCenter'))
const CancellationPolicy = lazy(() => import('./pages/CancellationPolicy'))
const RefundPolicy      = lazy(() => import('./pages/RefundPolicy'))
const Contact           = lazy(() => import('./pages/Contact'))
const TermsConditions   = lazy(() => import('./pages/TermsConditions'))
const PrivacyPolicy     = lazy(() => import('./pages/PrivacyPolicy'))
const Disclaimer        = lazy(() => import('./pages/Disclaimer'))
const Sitemap           = lazy(() => import('./pages/Sitemap'))
const RegisterHotel     = lazy(() => import('./pages/RegisterHotel'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

let cachedPhone = null

function WhatsAppButton() {
  const [phone, setPhone] = useState(cachedPhone || '919876969684')
  useEffect(() => {
    if (cachedPhone) return
    client.get('/api/admin/cms/public/homepage')
      .then(r => { if (r?.whatsapp_number) { cachedPhone = r.whatsapp_number.replace(/\D/g, ''); setPhone(cachedPhone) } })
      .catch(() => {})
  }, [])
  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
        width: 56, height: 56, borderRadius: '50%',
        background: '#25D366',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        textDecoration: 'none',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.5L4 29l7.697-1.813A11.94 11.94 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff" />
        <path d="M21.5 18.5c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" fill="#25D366" />
      </svg>
    </a>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="spinner" /></div>}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/*" element={
                <>
                  <Header />
                  <main style={{ minHeight: '60vh' }}>
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/hotels" element={<HotelListing />} />
                      <Route path="/hotels/:id" element={<HotelDetail />} />
                      <Route path="/booking" element={<Booking />} />
                      <Route path="/offers" element={<Offers />} />
                      <Route path="/my-bookings" element={<MyBookings />} />
                      <Route path="/register-hotel" element={<RegisterHotel />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/careers" element={<Careers />} />
                      <Route path="/press" element={<Press />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/cancellation" element={<CancellationPolicy />} />
                      <Route path="/refund-policy" element={<RefundPolicy />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/terms" element={<TermsConditions />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/disclaimer" element={<Disclaimer />} />
                      <Route path="/sitemap" element={<Sitemap />} />
                    </Routes>
                  </main>
                  <Footer />
                  <WhatsAppButton />
                </>
              } />
            </Routes>
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
