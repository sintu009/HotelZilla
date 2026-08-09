// Central mock data store for admin panel.
// All mutations (approve, reject, status changes) update these arrays in-memory.
// When you connect to PostgreSQL, replace these arrays + the helper functions
// below with real API calls.

export const HOTELS = [
  { id: 'h1', name: 'The Grand Palace Resort', city: 'Goa', state: 'Goa', country: 'India', address: 'Beach Road, Candolim', star_rating: 5, price_from: 4500, status: 'approved', cover_image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg', amenities: ['Swimming Pool','Spa','Free WiFi','Restaurant','Bar','Gym','Beach Access','Parking','AC','Room Service'], contact_phone: '+91 9876543210', contact_email: 'grandpalace@example.com', total_rooms: 120, owner: 'Ravi Sharma', owner_email: 'ravi@example.com', rejection_reason: '', created_at: '2026-01-10T10:00:00Z' },
  { id: 'h2', name: 'Ocean View Hotel', city: 'Goa', state: 'Goa', country: 'India', address: 'Colva Beach Road, Colva', star_rating: 4, price_from: 3200, status: 'approved', cover_image: 'https://images.pexels.com/photos/1571003/pexels-photo-1571003.jpeg', amenities: ['Swimming Pool','Free WiFi','Restaurant','Beach Access','AC','Parking'], contact_phone: '+91 9876543211', contact_email: 'oceanview@example.com', total_rooms: 80, owner: 'Priya Mehta', owner_email: 'priya@example.com', rejection_reason: '', created_at: '2026-01-15T10:00:00Z' },
  { id: 'h3', name: 'The Royal Heritage', city: 'Jaipur', state: 'Rajasthan', country: 'India', address: 'Amer Road, Jaipur', star_rating: 5, price_from: 6800, status: 'approved', cover_image: 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg', amenities: ['Swimming Pool','Spa','Free WiFi','Restaurant','Bar','Gym','Parking','AC','Room Service','Concierge'], contact_phone: '+91 9876543212', contact_email: 'royalheritage@example.com', total_rooms: 65, owner: 'Vikram Singh', owner_email: 'vikram@example.com', rejection_reason: '', created_at: '2026-01-20T10:00:00Z' },
  { id: 'h4', name: 'Mumbai Gateway Hotel', city: 'Mumbai', state: 'Maharashtra', country: 'India', address: 'Apollo Bunder, Colaba', star_rating: 4, price_from: 5500, status: 'approved', cover_image: 'https://images.pexels.com/photos/2422278/pexels-photo-2422278.jpeg', amenities: ['Free WiFi','Restaurant','Bar','Gym','AC','Room Service','Parking','Business Center'], contact_phone: '+91 9876543213', contact_email: 'mumbaigateway@example.com', total_rooms: 200, owner: 'Anita Desai', owner_email: 'anita@example.com', rejection_reason: '', created_at: '2026-02-01T10:00:00Z' },
  { id: 'h5', name: 'Kerala Backwaters Resort', city: 'Kerala', state: 'Kerala', country: 'India', address: 'Kumarakom, Kottayam', star_rating: 5, price_from: 7200, status: 'approved', cover_image: 'https://images.pexels.com/photos/3302152/pexels-photo-3302152.jpeg', amenities: ['Swimming Pool','Spa','Free WiFi','Restaurant','Bar','Beach Access','AC','Room Service','Parking','Yoga'], contact_phone: '+91 9876543214', contact_email: 'keralabackwaters@example.com', total_rooms: 45, owner: 'Suresh Nair', owner_email: 'suresh@example.com', rejection_reason: '', created_at: '2026-02-10T10:00:00Z' },
  { id: 'h6', name: 'Lake Palace Udaipur', city: 'Udaipur', state: 'Rajasthan', country: 'India', address: 'Lake Pichola, Udaipur', star_rating: 5, price_from: 9500, status: 'approved', cover_image: 'https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg', amenities: ['Swimming Pool','Spa','Free WiFi','Restaurant','Bar','Gym','AC','Room Service','Concierge','Parking'], contact_phone: '+91 9876543215', contact_email: 'lakepalace@example.com', total_rooms: 50, owner: 'Meera Rajput', owner_email: 'meera@example.com', rejection_reason: '', created_at: '2026-02-15T10:00:00Z' },
  { id: 'h7', name: 'Delhi Crown Plaza', city: 'Delhi', state: 'Delhi', country: 'India', address: 'Connaught Place, New Delhi', star_rating: 4, price_from: 4200, status: 'approved', cover_image: 'https://images.pexels.com/photos/1583416/pexels-photo-1583416.jpeg', amenities: ['Free WiFi','Restaurant','Bar','Gym','AC','Room Service','Parking','Business Center','Airport Shuttle'], contact_phone: '+91 9876543216', contact_email: 'delhicrown@example.com', total_rooms: 150, owner: 'Rohit Gupta', owner_email: 'rohit@example.com', rejection_reason: '', created_at: '2026-02-20T10:00:00Z' },
  { id: 'h8', name: 'Hill View Resort Mussoorie', city: 'Mussoorie', state: 'Uttarakhand', country: 'India', address: 'Mall Road, Mussoorie', star_rating: 3, price_from: 2800, status: 'approved', cover_image: 'https://images.pexels.com/photos/2422497/pexels-photo-2422497.jpeg', amenities: ['Free WiFi','Restaurant','Parking','AC','Room Service','Garden'], contact_phone: '+91 9876543217', contact_email: 'hillview@example.com', total_rooms: 60, owner: 'Neha Joshi', owner_email: 'neha@example.com', rejection_reason: '', created_at: '2026-03-01T10:00:00Z' },
  { id: 'h9', name: 'Sunset Bay Hotel', city: 'Goa', state: 'Goa', country: 'India', address: 'Vagator Beach, Goa', star_rating: 3, price_from: 2200, status: 'pending', cover_image: 'https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg', amenities: ['Free WiFi','Restaurant','AC','Parking'], contact_phone: '+91 9876543218', contact_email: 'sunsetbay@example.com', total_rooms: 40, owner: 'Arun Pillai', owner_email: 'arun@example.com', rejection_reason: '', created_at: '2026-07-10T10:00:00Z' },
  { id: 'h10', name: 'Mountain Peak Lodge', city: 'Manali', state: 'Himachal Pradesh', country: 'India', address: 'Manali, Kullu', star_rating: 2, price_from: 1800, status: 'pending', cover_image: 'https://images.pexels.com/photos/3302152/pexels-photo-3302152.jpeg', amenities: ['Free WiFi','Restaurant','Parking','Heating'], contact_phone: '+91 9876543219', contact_email: 'mountainpeak@example.com', total_rooms: 25, owner: 'Kavita Rana', owner_email: 'kavita@example.com', rejection_reason: '', created_at: '2026-07-18T10:00:00Z' },
  { id: 'h11', name: 'City Center Inn', city: 'Bengaluru', state: 'Karnataka', country: 'India', address: 'MG Road, Bengaluru', star_rating: 2, price_from: 1500, status: 'pending', cover_image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg', amenities: ['Free WiFi','AC','Parking'], contact_phone: '+91 9876543220', contact_email: 'citycenterinn@example.com', total_rooms: 35, owner: 'Deepak Kumar', owner_email: 'deepak@example.com', rejection_reason: '', created_at: '2026-08-01T10:00:00Z' },
  { id: 'h12', name: 'The Oasis Resort', city: 'Rajasthan', state: 'Rajasthan', country: 'India', address: 'Pushkar, Ajmer', star_rating: 3, price_from: 2400, status: 'rejected', cover_image: 'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg', amenities: ['Free WiFi','Restaurant','Parking'], contact_phone: '+91 9876543221', contact_email: 'oasisresort@example.com', total_rooms: 30, owner: 'Sunita Rathore', owner_email: 'sunita@example.com', rejection_reason: 'Insufficient documentation provided.', created_at: '2026-06-15T10:00:00Z' },
]

export const CUSTOMERS = [
  { id: 'c1', full_name: 'Aarav Sharma', email: 'aarav@example.com', phone: '+91 9811001100', role: 'customer', status: 'active', created_at: '2026-01-05T10:00:00Z' },
  { id: 'c2', full_name: 'Ananya Singh', email: 'ananya@example.com', phone: '+91 9822002200', role: 'customer', status: 'active', created_at: '2026-02-12T10:00:00Z' },
  { id: 'c3', full_name: 'Ishaan Patel', email: 'ishaan@example.com', phone: '+91 9833003300', role: 'customer', status: 'active', created_at: '2026-03-01T10:00:00Z' },
  { id: 'c4', full_name: 'Saanvi Mehta', email: 'saanvi@example.com', phone: '+91 9844004400', role: 'customer', status: 'suspended', created_at: '2026-03-20T10:00:00Z' },
  { id: 'c5', full_name: 'Vihaan Gupta', email: 'vihaan@example.com', phone: '+91 9855005500', role: 'customer', status: 'active', created_at: '2026-04-08T10:00:00Z' },
  { id: 'c6', full_name: 'Diya Nair', email: 'diya@example.com', phone: '+91 9866006600', role: 'customer', status: 'active', created_at: '2026-05-14T10:00:00Z' },
  { id: 'c7', full_name: 'Arjun Reddy', email: 'arjun@example.com', phone: '+91 9877007700', role: 'customer', status: 'active', created_at: '2026-06-02T10:00:00Z' },
  { id: 'c8', full_name: 'Pihu Joshi', email: 'pihu@example.com', phone: '+91 9888008800', role: 'customer', status: 'active', created_at: '2026-06-28T10:00:00Z' },
  { id: 'c9', full_name: 'Reyansh Das', email: 'reyansh@example.com', phone: '+91 9899009900', role: 'customer', status: 'suspended', created_at: '2026-07-05T10:00:00Z' },
  { id: 'c10', full_name: 'Navya Kapoor', email: 'navya@example.com', phone: '+91 9810101010', role: 'customer', status: 'active', created_at: '2026-07-22T10:00:00Z' },
  { id: 'c11', full_name: 'Ayaan Khan', email: 'ayaan@example.com', phone: '+91 9821212121', role: 'customer', status: 'active', created_at: '2026-08-01T10:00:00Z' },
  { id: 'c12', full_name: 'Myra Verma', email: 'myra@example.com', phone: '+91 9832323232', role: 'customer', status: 'active', created_at: '2026-08-06T10:00:00Z' },
]

export const HOTEL_OWNERS = [
  { id: 'o1', full_name: 'Ravi Sharma', email: 'ravi@example.com', phone: '+91 9876543210', role: 'hotel_owner', status: 'active', hotels_count: 1, approved: 1, pending: 0, created_at: '2025-12-01T10:00:00Z' },
  { id: 'o2', full_name: 'Priya Mehta', email: 'priya@example.com', phone: '+91 9876543211', role: 'hotel_owner', status: 'active', hotels_count: 1, approved: 1, pending: 0, created_at: '2025-12-15T10:00:00Z' },
  { id: 'o3', full_name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 9876543212', role: 'hotel_owner', status: 'active', hotels_count: 1, approved: 1, pending: 0, created_at: '2026-01-05T10:00:00Z' },
  { id: 'o4', full_name: 'Anita Desai', email: 'anita@example.com', phone: '+91 9876543213', role: 'hotel_owner', status: 'active', hotels_count: 1, approved: 1, pending: 0, created_at: '2026-01-20T10:00:00Z' },
  { id: 'o5', full_name: 'Suresh Nair', email: 'suresh@example.com', phone: '+91 9876543214', role: 'hotel_owner', status: 'active', hotels_count: 1, approved: 1, pending: 0, created_at: '2026-02-01T10:00:00Z' },
  { id: 'o6', full_name: 'Arun Pillai', email: 'arun@example.com', phone: '+91 9876543218', role: 'hotel_owner', status: 'active', hotels_count: 1, approved: 0, pending: 1, created_at: '2026-07-01T10:00:00Z' },
  { id: 'o7', full_name: 'Kavita Rana', email: 'kavita@example.com', phone: '+91 9876543219', role: 'hotel_owner', status: 'active', hotels_count: 1, approved: 0, pending: 1, created_at: '2026-07-10T10:00:00Z' },
  { id: 'o8', full_name: 'Deepak Kumar', email: 'deepak@example.com', phone: '+91 9876543220', role: 'hotel_owner', status: 'suspended', hotels_count: 1, approved: 0, pending: 1, created_at: '2026-07-25T10:00:00Z' },
]

export const BOOKINGS = [
  { id: 'bk1', booking_reference: 'BKA1B2C3D4', hotel_name: 'The Grand Palace Resort', hotel_id: 'h1', room_name: 'Deluxe Room', guest_name: 'Aarav Sharma', guest_email: 'aarav@example.com', guest_phone: '+91 9811001100', check_in: '2026-08-10', check_out: '2026-08-13', nights: 3, guests: 2, rooms_count: 1, base_amount: 13500, discount_amount: 0, tax_amount: 1620, total_amount: 15120, coupon_code: '', status: 'confirmed', special_requests: 'Sea facing room if available', created_at: '2026-08-01T10:30:00Z' },
  { id: 'bk2', booking_reference: 'BKE5F6G7H8', hotel_name: 'The Royal Heritage', hotel_id: 'h3', room_name: 'Royal Suite', guest_name: 'Ananya Singh', guest_email: 'ananya@example.com', guest_phone: '+91 9822002200', check_in: '2026-08-20', check_out: '2026-08-25', nights: 5, guests: 4, rooms_count: 1, base_amount: 34000, discount_amount: 3400, tax_amount: 3672, total_amount: 34272, coupon_code: 'SUMMER50', status: 'confirmed', special_requests: '', created_at: '2026-08-02T09:00:00Z' },
  { id: 'bk3', booking_reference: 'BKI9J0K1L2', hotel_name: 'Mumbai Gateway Hotel', hotel_id: 'h4', room_name: 'Business Room', guest_name: 'Ishaan Patel', guest_email: 'ishaan@example.com', guest_phone: '+91 9833003300', check_in: '2026-07-15', check_out: '2026-07-18', nights: 3, guests: 1, rooms_count: 1, base_amount: 16500, discount_amount: 0, tax_amount: 1980, total_amount: 18480, coupon_code: '', status: 'completed', special_requests: 'Early check-in', created_at: '2026-07-05T14:00:00Z' },
  { id: 'bk4', booking_reference: 'BKM3N4O5P6', hotel_name: 'Kerala Backwaters Resort', hotel_id: 'h5', room_name: 'Backwater Villa', guest_name: 'Saanvi Mehta', guest_email: 'saanvi@example.com', guest_phone: '+91 9844004400', check_in: '2026-08-05', check_out: '2026-08-08', nights: 3, guests: 2, rooms_count: 1, base_amount: 21600, discount_amount: 2160, tax_amount: 2333, total_amount: 21773, coupon_code: 'STAY15', status: 'confirmed', special_requests: '', created_at: '2026-07-28T11:00:00Z' },
  { id: 'bk5', booking_reference: 'BKQ7R8S9T0', hotel_name: 'Ocean View Hotel', hotel_id: 'h2', room_name: 'Sea Facing Room', guest_name: 'Vihaan Gupta', guest_email: 'vihaan@example.com', guest_phone: '+91 9855005500', check_in: '2026-06-20', check_out: '2026-06-22', nights: 2, guests: 2, rooms_count: 1, base_amount: 8000, discount_amount: 0, tax_amount: 960, total_amount: 8960, coupon_code: '', status: 'cancelled', special_requests: '', created_at: '2026-06-10T08:00:00Z' },
  { id: 'bk6', booking_reference: 'BKU1V2W3X4', hotel_name: 'Lake Palace Udaipur', hotel_id: 'h6', room_name: 'Lake View Suite', guest_name: 'Diya Nair', guest_email: 'diya@example.com', guest_phone: '+91 9866006600', check_in: '2026-09-01', check_out: '2026-09-05', nights: 4, guests: 2, rooms_count: 1, base_amount: 38000, discount_amount: 500, tax_amount: 4500, total_amount: 42000, coupon_code: 'LUXURY500', status: 'pending', special_requests: 'Honeymoon setup', created_at: '2026-08-07T16:00:00Z' },
  { id: 'bk7', booking_reference: 'BKY5Z6A7B8', hotel_name: 'Delhi Crown Plaza', hotel_id: 'h7', room_name: 'Executive Room', guest_name: 'Arjun Reddy', guest_email: 'arjun@example.com', guest_phone: '+91 9877007700', check_in: '2026-07-25', check_out: '2026-07-27', nights: 2, guests: 1, rooms_count: 1, base_amount: 8400, discount_amount: 0, tax_amount: 1008, total_amount: 9408, coupon_code: '', status: 'completed', special_requests: '', created_at: '2026-07-15T12:00:00Z' },
  { id: 'bk8', booking_reference: 'BKC9D0E1F2', hotel_name: 'Hill View Resort Mussoorie', hotel_id: 'h8', room_name: 'Mountain View Room', guest_name: 'Pihu Joshi', guest_email: 'pihu@example.com', guest_phone: '+91 9888008800', check_in: '2026-08-12', check_out: '2026-08-15', nights: 3, guests: 3, rooms_count: 2, base_amount: 16800, discount_amount: 200, tax_amount: 1992, total_amount: 18592, coupon_code: 'WELCOME200', status: 'confirmed', special_requests: '', created_at: '2026-08-04T09:30:00Z' },
]

export const PAYMENTS = [
  { id: 'pay1', transaction_id: 'TXN1723456789', booking_id: 'bk1', booking_reference: 'BKA1B2C3D4', hotel_name: 'The Grand Palace Resort', customer_email: 'aarav@example.com', amount: 15120, method: 'card', status: 'paid', payment_date: '2026-08-01T10:32:00Z' },
  { id: 'pay2', transaction_id: 'TXN1723512345', booking_id: 'bk2', booking_reference: 'BKE5F6G7H8', hotel_name: 'The Royal Heritage', customer_email: 'ananya@example.com', amount: 34272, method: 'upi', status: 'paid', payment_date: '2026-08-02T09:05:00Z' },
  { id: 'pay3', transaction_id: 'TXN1721234567', booking_id: 'bk3', booking_reference: 'BKI9J0K1L2', hotel_name: 'Mumbai Gateway Hotel', customer_email: 'ishaan@example.com', amount: 18480, method: 'netbanking', status: 'paid', payment_date: '2026-07-05T14:10:00Z' },
  { id: 'pay4', transaction_id: 'TXN1722876543', booking_id: 'bk4', booking_reference: 'BKM3N4O5P6', hotel_name: 'Kerala Backwaters Resort', customer_email: 'saanvi@example.com', amount: 21773, method: 'card', status: 'paid', payment_date: '2026-07-28T11:12:00Z' },
  { id: 'pay5', transaction_id: 'TXN1721765432', booking_id: 'bk5', booking_reference: 'BKQ7R8S9T0', hotel_name: 'Ocean View Hotel', customer_email: 'vihaan@example.com', amount: 8960, method: 'wallet', status: 'refunded', payment_date: '2026-06-10T08:15:00Z' },
  { id: 'pay6', transaction_id: 'TXN1723654321', booking_id: 'bk6', booking_reference: 'BKU1V2W3X4', hotel_name: 'Lake Palace Udaipur', customer_email: 'diya@example.com', amount: 42000, method: 'card', status: 'pending', payment_date: '2026-08-07T16:05:00Z' },
  { id: 'pay7', transaction_id: 'TXN1722543210', booking_id: 'bk7', booking_reference: 'BKY5Z6A7B8', hotel_name: 'Delhi Crown Plaza', customer_email: 'arjun@example.com', amount: 9408, method: 'upi', status: 'paid', payment_date: '2026-07-15T12:08:00Z' },
  { id: 'pay8', transaction_id: 'TXN1723789012', booking_id: 'bk8', booking_reference: 'BKC9D0E1F2', hotel_name: 'Hill View Resort Mussoorie', customer_email: 'pihu@example.com', amount: 18592, method: 'card', status: 'paid', payment_date: '2026-08-04T09:35:00Z' },
]

export const REFUNDS = [
  { id: 'rf1', booking_reference: 'BKQ7R8S9T0', hotel_name: 'Ocean View Hotel', customer_email: 'vihaan@example.com', payment_id: 'pay5', booking_id: 'bk5', amount: 8960, reason: 'Customer cancelled due to emergency', status: 'processed', processed_at: '2026-06-12T10:00:00Z', created_at: '2026-06-11T08:00:00Z' },
  { id: 'rf2', booking_reference: 'BKU1V2W3X4', hotel_name: 'Lake Palace Udaipur', customer_email: 'diya@example.com', payment_id: 'pay6', booking_id: 'bk6', amount: 21000, reason: 'Partial refund requested for date change', status: 'pending', processed_at: null, created_at: '2026-08-08T10:00:00Z' },
  { id: 'rf3', booking_reference: 'BKM3N4O5P6', hotel_name: 'Kerala Backwaters Resort', customer_email: 'saanvi@example.com', payment_id: 'pay4', booking_id: 'bk4', amount: 21773, reason: 'Hotel not as described', status: 'rejected', processed_at: null, created_at: '2026-08-09T12:00:00Z' },
]

export const REVIEWS = [
  { id: 'rv1', hotel_name: 'The Grand Palace Resort', hotel_id: 'h1', reviewer: 'Aarav Sharma', reviewer_email: 'aarav@example.com', rating: 5, title: 'Absolutely Stunning!', comment: 'Best hotel experience I have ever had. The pool is amazing and the staff is very helpful.', is_approved: true, created_at: '2026-08-04T08:00:00Z' },
  { id: 'rv2', hotel_name: 'The Royal Heritage', hotel_id: 'h3', reviewer: 'Ananya Singh', reviewer_email: 'ananya@example.com', rating: 4, title: 'Royal Experience', comment: 'Loved the heritage décor. Food was great. Some rooms need renovation but overall excellent.', is_approved: true, created_at: '2026-08-06T09:00:00Z' },
  { id: 'rv3', hotel_name: 'Mumbai Gateway Hotel', hotel_id: 'h4', reviewer: 'Ishaan Patel', reviewer_email: 'ishaan@example.com', rating: 4, title: 'Great for business travel', comment: 'Efficient, clean, great location near the Gateway. The business center is well-equipped.', is_approved: true, created_at: '2026-07-20T11:00:00Z' },
  { id: 'rv4', hotel_name: 'Kerala Backwaters Resort', hotel_id: 'h5', reviewer: 'Saanvi Mehta', reviewer_email: 'saanvi@example.com', rating: 5, title: 'Paradise found!', comment: 'Waking up to the backwaters every morning was magical. Highly recommend the Ayurvedic spa.', is_approved: false, created_at: '2026-08-09T07:00:00Z' },
  { id: 'rv5', hotel_name: 'Ocean View Hotel', hotel_id: 'h2', reviewer: 'Vihaan Gupta', reviewer_email: 'vihaan@example.com', rating: 2, title: 'Disappointing', comment: 'Room was not clean, AC was not working properly. Expected better for the price.', is_approved: false, created_at: '2026-08-08T15:00:00Z' },
  { id: 'rv6', hotel_name: 'Delhi Crown Plaza', hotel_id: 'h7', reviewer: 'Arjun Reddy', reviewer_email: 'arjun@example.com', rating: 4, title: 'Solid choice in Delhi', comment: 'Comfortable, well-located, great breakfast buffet. Would stay again.', is_approved: true, created_at: '2026-07-28T10:00:00Z' },
]

export const OFFERS = [
  { id: 'of1', title: 'Summer Super Saver', description: 'Get up to 50% off on summer bookings', discount_type: 'percentage', discount_value: 50, code: 'SUMMER50', image_url: 'https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg', start_date: '2026-06-01', end_date: '2026-09-30', is_active: true, created_at: '2026-05-20T10:00:00Z' },
  { id: 'of2', title: 'New User Offer', description: 'Flat ₹1000 off on your first booking', discount_type: 'flat', discount_value: 1000, code: 'FIRST1000', image_url: 'https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg', start_date: '2026-01-01', end_date: '2026-12-31', is_active: true, created_at: '2026-01-01T10:00:00Z' },
  { id: 'of3', title: 'Weekend Special', description: '25% off on weekend stays', discount_type: 'percentage', discount_value: 25, code: 'WEEKEND25', image_url: 'https://images.pexels.com/photos/1450363/pexels-photo-1450363.jpeg', start_date: '2026-04-01', end_date: '2026-10-31', is_active: true, created_at: '2026-03-25T10:00:00Z' },
  { id: 'of4', title: 'Monsoon Magic', description: '20% off on monsoon bookings', discount_type: 'percentage', discount_value: 20, code: 'MONSOON20', image_url: 'https://images.pexels.com/photos/3302152/pexels-photo-3302152.jpeg', start_date: '2026-06-01', end_date: '2026-09-15', is_active: false, created_at: '2026-05-28T10:00:00Z' },
]

export const COUPONS = [
  { id: 'cp1', code: 'WELCOME200', description: '₹200 off on bookings above ₹2000', discount_type: 'flat', discount_value: 200, min_order_amount: 2000, max_discount_amount: 200, usage_limit: 1000, used_count: 45, valid_from: '2026-01-01', valid_until: '2026-12-31', is_active: true, created_at: '2026-01-01T10:00:00Z' },
  { id: 'cp2', code: 'STAY15', description: '15% off on all bookings', discount_type: 'percentage', discount_value: 15, min_order_amount: 0, max_discount_amount: 3000, usage_limit: 500, used_count: 120, valid_from: '2026-03-01', valid_until: '2026-09-30', is_active: true, created_at: '2026-03-01T10:00:00Z' },
  { id: 'cp3', code: 'LUXURY500', description: '₹500 off on luxury hotels above ₹5000', discount_type: 'flat', discount_value: 500, min_order_amount: 5000, max_discount_amount: 500, usage_limit: 200, used_count: 30, valid_from: '2026-04-01', valid_until: '2026-10-31', is_active: true, created_at: '2026-04-01T10:00:00Z' },
  { id: 'cp4', code: 'MONSOON10', description: '10% off monsoon special', discount_type: 'percentage', discount_value: 10, min_order_amount: 1000, max_discount_amount: 1500, usage_limit: 1000, used_count: 210, valid_from: '2026-06-01', valid_until: '2026-09-15', is_active: true, created_at: '2026-06-01T10:00:00Z' },
  { id: 'cp5', code: 'SUMMER50', description: '50% off summer deals', discount_type: 'percentage', discount_value: 50, min_order_amount: 5000, max_discount_amount: 10000, usage_limit: 300, used_count: 88, valid_from: '2026-05-01', valid_until: '2026-08-31', is_active: true, created_at: '2026-05-01T10:00:00Z' },
]

export const COMMISSIONS = [
  { id: 'cm1', booking_reference: 'BKA1B2C3D4', hotel_name: 'The Grand Palace Resort', booking_amount: 15120, commission_rate: 10, commission_amount: 1512, payout_status: 'pending', payout_date: null, created_at: '2026-08-01T10:32:00Z' },
  { id: 'cm2', booking_reference: 'BKE5F6G7H8', hotel_name: 'The Royal Heritage', booking_amount: 34272, commission_rate: 10, commission_amount: 3427, payout_status: 'pending', payout_date: null, created_at: '2026-08-02T09:05:00Z' },
  { id: 'cm3', booking_reference: 'BKI9J0K1L2', hotel_name: 'Mumbai Gateway Hotel', booking_amount: 18480, commission_rate: 10, commission_amount: 1848, payout_status: 'paid', payout_date: '2026-08-05T10:00:00Z', created_at: '2026-07-05T14:10:00Z' },
  { id: 'cm4', booking_reference: 'BKM3N4O5P6', hotel_name: 'Kerala Backwaters Resort', booking_amount: 21773, commission_rate: 10, commission_amount: 2177, payout_status: 'paid', payout_date: '2026-08-05T10:00:00Z', created_at: '2026-07-28T11:12:00Z' },
  { id: 'cm5', booking_reference: 'BKY5Z6A7B8', hotel_name: 'Delhi Crown Plaza', booking_amount: 9408, commission_rate: 10, commission_amount: 940, payout_status: 'paid', payout_date: '2026-08-01T10:00:00Z', created_at: '2026-07-15T12:08:00Z' },
  { id: 'cm6', booking_reference: 'BKC9D0E1F2', hotel_name: 'Hill View Resort Mussoorie', booking_amount: 18592, commission_rate: 10, commission_amount: 1859, payout_status: 'pending', payout_date: null, created_at: '2026-08-04T09:35:00Z' },
  { id: 'cm7', booking_reference: 'BKU1V2W3X4', hotel_name: 'Lake Palace Udaipur', booking_amount: 42000, commission_rate: 10, commission_amount: 4200, payout_status: 'on_hold', payout_date: null, created_at: '2026-08-07T16:05:00Z' },
]

export const CMS_HOMEPAGE = {
  hero_title: 'Find Your Perfect Stay',
  hero_subtitle: 'Discover and book from thousands of hotels worldwide',
  hero_search_placeholder: 'Search by city, hotel, or location',
  feature_section_title: 'Why Book With Us',
  stats_hotels: '50,000+ Hotels',
  stats_customers: '10M+ Happy Customers',
  stats_cities: '1,500+ Cities',
}

export const CMS_BANNERS = [
  { id: 'bn1', title: 'Summer Sale', subtitle: 'Up to 50% off on luxury hotels', image_url: 'https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg', link_url: '/offers', display_order: 1, is_active: true },
  { id: 'bn2', title: 'Weekend Getaways', subtitle: 'Book your perfect weekend stay', image_url: 'https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg', link_url: '/hotels', display_order: 2, is_active: true },
  { id: 'bn3', title: 'Honeymoon Special', subtitle: 'Romantic stays with exclusive deals', image_url: 'https://images.pexels.com/photos/1450363/pexels-photo-1450363.jpeg', link_url: '/offers', display_order: 3, is_active: false },
]

export const CMS_DESTINATIONS = [
  { id: 'dn1', name: 'Goa', country: 'India', image_url: 'https://images.pexels.com/photos/2422497/pexels-photo-2422497.jpeg', hotel_count: 1240, display_order: 1, is_active: true },
  { id: 'dn2', name: 'Mumbai', country: 'India', image_url: 'https://images.pexels.com/photos/2422278/pexels-photo-2422278.jpeg', hotel_count: 3580, display_order: 2, is_active: true },
  { id: 'dn3', name: 'Delhi', country: 'India', image_url: 'https://images.pexels.com/photos/1583416/pexels-photo-1583416.jpeg', hotel_count: 4120, display_order: 3, is_active: true },
  { id: 'dn4', name: 'Jaipur', country: 'India', image_url: 'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg', hotel_count: 890, display_order: 4, is_active: true },
  { id: 'dn5', name: 'Kerala', country: 'India', image_url: 'https://images.pexels.com/photos/3302152/pexels-photo-3302152.jpeg', hotel_count: 1560, display_order: 5, is_active: true },
  { id: 'dn6', name: 'Udaipur', country: 'India', image_url: 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg', hotel_count: 720, display_order: 6, is_active: false },
]

export const CMS_OFFERS_CONTENT = {
  section_title: 'Exclusive Offers',
  section_subtitle: 'Save big on your next stay',
}

export const SETTINGS = {
  platform_name: 'StayFinder',
  support_email: 'support@stayfinder.com',
  contact_phone: '+91 1800 123 4567',
  currency: 'INR',
  currency_symbol: '₹',
  default_commission_rate: 10,
  tax_rate: 12,
  address: '100, Tech Park, Bengaluru, Karnataka 560001',
}

// ---- Derived stats used by Dashboard & Reports ----
export function getStats() {
  const paidPayments = PAYMENTS.filter(p => p.status === 'paid')
  const totalRevenue = paidPayments.reduce((s, p) => s + p.amount, 0)
  const totalCommission = COMMISSIONS.reduce((s, c) => s + c.commission_amount, 0)
  const avgRating = REVIEWS.length > 0 ? (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1) : '—'
  const couponUsage = COUPONS.reduce((s, c) => s + c.used_count, 0)
  return {
    totalHotels: HOTELS.length,
    pendingHotels: HOTELS.filter(h => h.status === 'pending').length,
    approvedHotels: HOTELS.filter(h => h.status === 'approved').length,
    rejectedHotels: HOTELS.filter(h => h.status === 'rejected').length,
    totalUsers: CUSTOMERS.length + HOTEL_OWNERS.length,
    customers: CUSTOMERS.length,
    owners: HOTEL_OWNERS.length,
    totalBookings: BOOKINGS.length,
    confirmedBookings: BOOKINGS.filter(b => b.status === 'confirmed').length,
    completedBookings: BOOKINGS.filter(b => b.status === 'completed').length,
    cancelledBookings: BOOKINGS.filter(b => b.status === 'cancelled').length,
    totalRevenue,
    totalCommission,
    pendingCommission: COMMISSIONS.filter(c => c.payout_status === 'pending').reduce((s, c) => s + c.commission_amount, 0),
    avgRating,
    activeOffers: OFFERS.filter(o => o.is_active).length,
    couponUsage,
  }
}
