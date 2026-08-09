// Mock data for the hotel partner dashboard.
// Replace with API calls when Node.js + PostgreSQL backend is ready.

export const PARTNER = {
  name: 'Ravi Sharma',
  email: 'ravi@example.com',
  phone: '+91 9876543210',
  company: 'Grand Palace Resorts Pvt. Ltd.',
  joined: '2025-12-01',
  avatar: 'R',
}

export const HOTELS = [
  {
    id: 'h1', name: 'The Grand Palace Resort', city: 'Goa', state: 'Goa', address: 'Beach Road, Candolim, Goa 403515',
    star_rating: 5, price_from: 4500, status: 'approved', total_rooms: 120,
    cover_image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
    amenities: ['Swimming Pool','Spa','Free WiFi','Restaurant','Bar','Gym','Beach Access','Parking','AC','Room Service'],
    description: 'A luxurious 5-star beachfront resort with panoramic ocean views, world-class spa, and fine dining.',
    contact_phone: '+91 9876543210', contact_email: 'grandpalace@example.com',
    commission_rate: 10, rating: 4.8, review_count: 156, created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'h2', name: 'Ocean View Hotel', city: 'Goa', state: 'Goa', address: 'Colva Beach Road, Colva, Goa 403708',
    star_rating: 4, price_from: 3200, status: 'approved', total_rooms: 80,
    cover_image: 'https://images.pexels.com/photos/1571003/pexels-photo-1571003.jpeg',
    amenities: ['Swimming Pool','Free WiFi','Restaurant','Beach Access','AC','Parking'],
    description: 'A charming 4-star hotel overlooking Colva Beach with modern amenities and warm hospitality.',
    contact_phone: '+91 9876543211', contact_email: 'oceanview@example.com',
    commission_rate: 10, rating: 4.5, review_count: 89, created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'h3', name: 'Sunset Bay Hotel', city: 'Goa', state: 'Goa', address: 'Vagator Beach, Goa 403509',
    star_rating: 3, price_from: 2200, status: 'pending', total_rooms: 40,
    cover_image: 'https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg',
    amenities: ['Free WiFi','Restaurant','AC','Parking'],
    description: 'A cozy 3-star hotel near Vagator Beach, perfect for budget-conscious travelers.',
    contact_phone: '+91 9876543218', contact_email: 'sunsetbay@example.com',
    commission_rate: 10, rating: 0, review_count: 0, created_at: '2026-07-10T10:00:00Z',
  },
]

export const ROOMS = [
  { id: 'r1', hotel_id: 'h1', name: 'Deluxe Room', base_price: 4500, max_guests: 2, total_inventory: 50, amenities: ['AC','Free WiFi','TV','Mini Bar'], bed_type: 'King', size_sqft: 320, status: 'active' },
  { id: 'r2', hotel_id: 'h1', name: 'Premium Suite', base_price: 6800, max_guests: 4, total_inventory: 20, amenities: ['AC','Free WiFi','TV','Mini Bar','Jacuzzi','Sea View'], bed_type: 'King', size_sqft: 550, status: 'active' },
  { id: 'r3', hotel_id: 'h1', name: 'Family Room', base_price: 5500, max_guests: 4, total_inventory: 30, amenities: ['AC','Free WiFi','TV','Mini Bar'], bed_type: '2 Queen', size_sqft: 400, status: 'active' },
  { id: 'r4', hotel_id: 'h1', name: 'Beach Villa', base_price: 12000, max_guests: 6, total_inventory: 10, amenities: ['AC','Free WiFi','TV','Mini Bar','Private Pool','Beach Access','Butler'], bed_type: 'King + 2 Twin', size_sqft: 800, status: 'active' },
  { id: 'r5', hotel_id: 'h1', name: 'Standard Room', base_price: 3500, max_guests: 2, total_inventory: 10, amenities: ['AC','Free WiFi','TV'], bed_type: 'Queen', size_sqft: 250, status: 'inactive' },
  { id: 'r6', hotel_id: 'h2', name: 'Sea Facing Room', base_price: 3200, max_guests: 2, total_inventory: 40, amenities: ['AC','Free WiFi','TV','Sea View'], bed_type: 'King', size_sqft: 280, status: 'active' },
  { id: 'r7', hotel_id: 'h2', name: 'Garden View Room', base_price: 2800, max_guests: 2, total_inventory: 30, amenities: ['AC','Free WiFi','TV','Garden View'], bed_type: 'Queen', size_sqft: 240, status: 'active' },
  { id: 'r8', hotel_id: 'h2', name: 'Deluxe Suite', base_price: 4800, max_guests: 3, total_inventory: 10, amenities: ['AC','Free WiFi','TV','Mini Bar','Sea View','Living Area'], bed_type: 'King + Sofa', size_sqft: 450, status: 'active' },
]

export const BOOKINGS = [
  { id: 'bk1', booking_reference: 'BKA1B2C3D4', hotel_id: 'h1', hotel_name: 'The Grand Palace Resort', room_name: 'Deluxe Room', guest_name: 'Aarav Sharma', guest_email: 'aarav@example.com', guest_phone: '+91 9811001100', check_in: '2026-08-10', check_out: '2026-08-13', nights: 3, guests: 2, rooms_count: 1, base_amount: 13500, discount_amount: 0, tax_amount: 1620, total_amount: 15120, commission: 1512, payout: 13608, status: 'confirmed', payment_status: 'paid', special_requests: 'Sea facing room if available', created_at: '2026-08-01T10:30:00Z' },
  { id: 'bk2', booking_reference: 'BKZ9Y8X7W6', hotel_id: 'h1', hotel_name: 'The Grand Palace Resort', room_name: 'Premium Suite', guest_name: 'Karan Malhotra', guest_email: 'karan@example.com', guest_phone: '+91 9911009900', check_in: '2026-08-15', check_out: '2026-08-18', nights: 3, guests: 4, rooms_count: 1, base_amount: 20400, discount_amount: 2040, tax_amount: 2203, total_amount: 22563, commission: 2256, payout: 20307, status: 'confirmed', payment_status: 'paid', special_requests: '', created_at: '2026-08-05T14:00:00Z' },
  { id: 'bk3', booking_reference: 'BKP3Q4R5S6', hotel_id: 'h1', hotel_name: 'The Grand Palace Resort', room_name: 'Beach Villa', guest_name: 'Riya Kapoor', guest_email: 'riya@example.com', guest_phone: '+91 9922008800', check_in: '2026-07-20', check_out: '2026-07-25', nights: 5, guests: 6, rooms_count: 1, base_amount: 60000, discount_amount: 6000, tax_amount: 6480, total_amount: 60480, commission: 6048, payout: 54432, status: 'completed', payment_status: 'paid', special_requests: 'Anniversary celebration setup', created_at: '2026-07-10T09:00:00Z' },
  { id: 'bk4', booking_reference: 'BKT7U8V9W0', hotel_id: 'h1', hotel_name: 'The Grand Palace Resort', room_name: 'Family Room', guest_name: 'Sneha Agarwal', guest_email: 'sneha@example.com', guest_phone: '+91 9933007700', check_in: '2026-08-22', check_out: '2026-08-24', nights: 2, guests: 4, rooms_count: 1, base_amount: 11000, discount_amount: 0, tax_amount: 1320, total_amount: 12320, commission: 1232, payout: 11088, status: 'confirmed', payment_status: 'paid', special_requests: 'Extra bed for child', created_at: '2026-08-08T11:00:00Z' },
  { id: 'bk5', booking_reference: 'BKA2B3C4D5', hotel_id: 'h2', hotel_name: 'Ocean View Hotel', room_name: 'Sea Facing Room', guest_name: 'Vihaan Gupta', guest_email: 'vihaan@example.com', guest_phone: '+91 9855005500', check_in: '2026-06-20', check_out: '2026-06-22', nights: 2, guests: 2, rooms_count: 1, base_amount: 6400, discount_amount: 0, tax_amount: 768, total_amount: 7168, commission: 717, payout: 6451, status: 'cancelled', payment_status: 'refunded', special_requests: '', created_at: '2026-06-10T08:00:00Z' },
  { id: 'bk6', booking_reference: 'BKE5F6G7H8', hotel_id: 'h2', hotel_name: 'Ocean View Hotel', room_name: 'Deluxe Suite', guest_name: 'Ananya Singh', guest_email: 'ananya@example.com', guest_phone: '+91 9822002200', check_in: '2026-09-01', check_out: '2026-09-04', nights: 3, guests: 3, rooms_count: 1, base_amount: 14400, discount_amount: 1440, tax_amount: 1555, total_amount: 14515, commission: 1452, payout: 13063, status: 'confirmed', payment_status: 'paid', special_requests: 'Late check-in around 9 PM', created_at: '2026-08-09T15:00:00Z' },
  { id: 'bk7', booking_reference: 'BKI9J0K1L2', hotel_id: 'h1', hotel_name: 'The Grand Palace Resort', room_name: 'Deluxe Room', guest_name: 'Ishaan Patel', guest_email: 'ishaan@example.com', guest_phone: '+91 9833003300', check_in: '2026-07-05', check_out: '2026-07-08', nights: 3, guests: 2, rooms_count: 1, base_amount: 13500, discount_amount: 0, tax_amount: 1620, total_amount: 15120, commission: 1512, payout: 13608, status: 'completed', payment_status: 'paid', special_requests: '', created_at: '2026-06-28T12:00:00Z' },
  { id: 'bk8', booking_reference: 'BKM3N4O5P6', hotel_id: 'h2', hotel_name: 'Ocean View Hotel', room_name: 'Garden View Room', guest_name: 'Diya Nair', guest_email: 'diya@example.com', guest_phone: '+91 9866006600', check_in: '2026-08-18', check_out: '2026-08-20', nights: 2, guests: 2, rooms_count: 1, base_amount: 5600, discount_amount: 560, tax_amount: 605, total_amount: 5645, commission: 565, payout: 5080, status: 'confirmed', payment_status: 'paid', special_requests: '', created_at: '2026-08-10T10:00:00Z' },
]

export const REVIEWS = [
  { id: 'rv1', hotel_id: 'h1', hotel_name: 'The Grand Palace Resort', reviewer: 'Aarav Sharma', rating: 5, title: 'Absolutely Stunning!', comment: 'Best hotel experience I have ever had. The pool is amazing and the staff is very helpful. Beach villa is worth every rupee.', is_approved: true, created_at: '2026-08-04T08:00:00Z' },
  { id: 'rv2', hotel_id: 'h1', hotel_name: 'The Grand Palace Resort', reviewer: 'Riya Kapoor', rating: 5, title: 'Perfect Anniversary Getaway', comment: 'The staff arranged a surprise cake and decorated our room. The private pool villa was incredible. Will definitely return!', is_approved: true, created_at: '2026-07-28T10:00:00Z' },
  { id: 'rv3', hotel_id: 'h1', hotel_name: 'The Grand Palace Resort', reviewer: 'Ishaan Patel', rating: 4, title: 'Great stay, minor issues', comment: 'The deluxe room was comfortable and clean. Room service was a bit slow but the food was excellent. Overall a good experience.', is_approved: true, created_at: '2026-07-10T11:00:00Z' },
  { id: 'rv4', hotel_id: 'h1', hotel_name: 'The Grand Palace Resort', reviewer: 'Karan Malhotra', rating: 5, title: 'Premium Suite exceeded expectations', comment: 'The suite was spacious with a stunning view. The jacuzzi was a great touch. Staff went above and beyond.', is_approved: false, created_at: '2026-08-09T09:00:00Z' },
  { id: 'rv5', hotel_id: 'h2', hotel_name: 'Ocean View Hotel', reviewer: 'Ananya Singh', rating: 4, title: 'Lovely beachside hotel', comment: 'Great location right on the beach. The sea-facing room had a beautiful view. Breakfast spread was good.', is_approved: true, created_at: '2026-06-25T08:00:00Z' },
  { id: 'rv6', hotel_id: 'h2', hotel_name: 'Ocean View Hotel', reviewer: 'Diya Nair', rating: 3, title: 'Decent for the price', comment: 'The garden view room was okay. A bit dated but clean. The staff was friendly. Good budget option.', is_approved: false, created_at: '2026-08-11T14:00:00Z' },
]

export const EARNINGS = {
  total_revenue: 152018,
  total_commission: 15202,
  net_payout: 136816,
  pending_payout: 49487,
  paid_out: 87329,
  this_month_revenue: 57598,
  this_month_commission: 5760,
  this_month_payout: 51838,
  last_6_months: [
    { month: 'Mar', revenue: 18000, payout: 16200 },
    { month: 'Apr', revenue: 22000, payout: 19800 },
    { month: 'May', revenue: 28000, payout: 25200 },
    { month: 'Jun', revenue: 7168,  payout: 6451 },
    { month: 'Jul', revenue: 75600, payout: 68040 },
    { month: 'Aug', revenue: 57598, payout: 51838 },
  ],
  recent_payouts: [
    { id: 'po1', period: 'Jul 2026', amount: 68040, status: 'paid', date: '2026-08-01', transactions: 2 },
    { id: 'po2', period: 'Jun 2026', amount: 6451, status: 'paid', date: '2026-07-01', transactions: 1 },
    { id: 'po3', period: 'May 2026', amount: 25200, status: 'paid', date: '2026-06-01', transactions: 3 },
    { id: 'po4', period: 'Aug 2026', amount: 51838, status: 'pending', date: null, transactions: 4 },
  ],
}

export function getDashboardStats() {
  const activeBookings = BOOKINGS.filter(b => b.status === 'confirmed' || b.status === 'pending')
  const completedBookings = BOOKINGS.filter(b => b.status === 'completed')
  const cancelledBookings = BOOKINGS.filter(b => b.status === 'cancelled')
  const totalRevenue = BOOKINGS.filter(b => b.payment_status === 'paid').reduce((s, b) => s + b.total_amount, 0)
  const totalPayout = BOOKINGS.filter(b => b.payment_status === 'paid').reduce((s, b) => s + b.payout, 0)
  const avgRating = HOTELS.reduce((s, h) => s + h.rating, 0) / HOTELS.length

  return {
    totalHotels: HOTELS.length,
    approvedHotels: HOTELS.filter(h => h.status === 'approved').length,
    pendingHotels: HOTELS.filter(h => h.status === 'pending').length,
    totalRooms: ROOMS.length,
    activeRooms: ROOMS.filter(r => r.status === 'active').length,
    totalBookings: BOOKINGS.length,
    activeBookings: activeBookings.length,
    completedBookings: completedBookings.length,
    cancelledBookings: cancelledBookings.length,
    totalRevenue,
    totalPayout,
    avgRating: avgRating.toFixed(1),
    totalReviews: REVIEWS.length,
    approvedReviews: REVIEWS.filter(r => r.is_approved).length,
  }
}
