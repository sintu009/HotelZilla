import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

const QUICK_REPLIES = [
  'Find hotels in Goa',
  'Best budget stays',
  'How to cancel booking?',
  'Current offers & deals',
]

const BOT_RESPONSES = {
  greet: "Hi there! 👋 I'm AstiBot, your travel assistant. How can I help you today?",
  default: "I'd be happy to help! You can ask me about hotels, bookings, offers, or travel tips. What are you looking for?",
  hotel: "We have amazing hotels across India! 🏨 Try searching by city on our Hotels page, or tell me your destination and I'll guide you.",
  goa: "Goa is a top pick! 🌊 We have beachside resorts, budget guesthouses, and luxury villas. Check out our Hotels page and filter by Goa.",
  mumbai: "Mumbai has great options from business hotels to boutique stays. 🏙️ Head to Hotels and search 'Mumbai' to explore.",
  delhi: "Delhi has everything from heritage havelis to modern 5-stars! 🕌 Search 'Delhi' on our Hotels page.",
  budget: "Looking for budget stays? 💰 Use the price filter on our Hotels page to find great deals under ₹2000/night.",
  cancel: "To cancel a booking, go to My Bookings, select your reservation, and click Cancel. Refunds are processed within 5–7 business days. 📋",
  offer: "We have exciting deals right now! 🎉 Visit our Offers page for discount codes and seasonal promotions.",
  refund: "Refunds are processed within 5–7 business days after cancellation. For urgent queries, contact support@astitrip.com 📧",
  checkin: "Check-in time is usually 2:00 PM and check-out is 11:00 AM, but it varies by hotel. You can see exact timings on the hotel detail page. ⏰",
  amenity: "Most of our hotels offer free WiFi, parking, and breakfast options. Use the amenity filters on the Hotels page to find exactly what you need! 🛎️",
  payment: "We accept all major credit/debit cards, UPI, and net banking. All payments are 100% secure. 🔒",
  support: "For urgent help, email us at support@astitrip.com or call 1800-XXX-XXXX (toll-free). We're available 24/7! 📞",
}

function getBotReply(text) {
  const t = text.toLowerCase()
  if (/\b(hi|hello|hey|hola|namaste)\b/.test(t)) return BOT_RESPONSES.greet
  if (/goa/.test(t)) return BOT_RESPONSES.goa
  if (/mumbai|bombay/.test(t)) return BOT_RESPONSES.mumbai
  if (/delhi|new delhi/.test(t)) return BOT_RESPONSES.delhi
  if (/hotel|stay|room|accommodation/.test(t)) return BOT_RESPONSES.hotel
  if (/budget|cheap|affordable|low.?cost/.test(t)) return BOT_RESPONSES.budget
  if (/cancel/.test(t)) return BOT_RESPONSES.cancel
  if (/offer|deal|discount|coupon|promo/.test(t)) return BOT_RESPONSES.offer
  if (/refund/.test(t)) return BOT_RESPONSES.refund
  if (/check.?in|check.?out|timing/.test(t)) return BOT_RESPONSES.checkin
  if (/wifi|parking|breakfast|amenity|pool/.test(t)) return BOT_RESPONSES.amenity
  if (/pay|payment|upi|card/.test(t)) return BOT_RESPONSES.payment
  if (/support|help|contact|call/.test(t)) return BOT_RESPONSES.support
  return BOT_RESPONSES.default
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: BOT_RESPONSES.greet, id: 0 },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  function sendMessage(text) {
    const msg = text.trim()
    if (!msg) return
    setMessages(prev => [...prev, { from: 'user', text: msg, id: Date.now() }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { from: 'bot', text: getBotReply(msg), id: Date.now() + 1 }])
    }, 900)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #176b5c, #008f7b)',
          color: '#fff', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(23,107,92,0.45)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="Open chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 96, right: 28, zIndex: 999,
          width: 360, maxHeight: 520,
          background: '#fff', borderRadius: 16,
          boxShadow: '0 8px 40px rgba(0,0,0,0.16)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', animation: 'chatSlideUp 0.25s ease',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #176b5c, #008f7b)',
            padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={20} color="#fff" />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>AstiBot</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                Online · Travel Assistant
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              marginLeft: 'auto', background: 'rgba(255,255,255,0.15)',
              border: 'none', borderRadius: 8, width: 30, height: 30,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer',
            }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map(m => (
              <div key={m.id} style={{
                display: 'flex', gap: 8,
                flexDirection: m.from === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: m.from === 'bot' ? '#e6f4f1' : '#176b5c',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {m.from === 'bot'
                    ? <Bot size={14} color="#176b5c" />
                    : <User size={14} color="#fff" />}
                </div>
                <div style={{
                  maxWidth: '75%', padding: '9px 13px',
                  borderRadius: m.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.from === 'user' ? '#176b5c' : '#f3f8f7',
                  color: m.from === 'user' ? '#fff' : '#1a1d29',
                  fontSize: '0.85rem', lineHeight: 1.5,
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e6f4f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={14} color="#176b5c" />
                </div>
                <div style={{ padding: '10px 14px', background: '#f3f8f7', borderRadius: '14px 14px 14px 4px', display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 7, height: 7, borderRadius: '50%', background: '#176b5c',
                      animation: `dotBounce 1s ${i * 0.2}s infinite`,
                      display: 'inline-block',
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div style={{ padding: '0 14px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {QUICK_REPLIES.map(q => (
                <button key={q} onClick={() => sendMessage(q)} style={{
                  padding: '5px 11px', borderRadius: 20,
                  border: '1px solid #c8e6e0', background: '#f0faf8',
                  color: '#176b5c', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#d9f4ef'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f0faf8'}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '10px 14px 14px', borderTop: '1px solid #eef2f1',
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              style={{
                flex: 1, padding: '9px 14px', borderRadius: 24,
                border: '1px solid #dde8e6', outline: 'none',
                fontSize: '0.85rem', background: '#f8faf9',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#176b5c'}
              onBlur={e => e.target.style.borderColor = '#dde8e6'}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              style={{
                width: 38, height: 38, borderRadius: '50%',
                background: input.trim() ? '#176b5c' : '#e5e7eb',
                border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
                flexShrink: 0,
              }}
            >
              <Send size={16} color={input.trim() ? '#fff' : '#9ca3af'} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%            { transform: translateY(-5px); }
        }
      `}</style>
    </>
  )
}
