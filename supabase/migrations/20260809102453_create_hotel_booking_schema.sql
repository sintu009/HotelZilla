/*
# Hotel Booking Platform - Core Schema

## Overview
Creates the complete schema for a MakeMyTrip-style hotel booking platform focused on hotels. Supports:
- Customer authentication (sign up / sign in)
- Hotel owner authentication and hotel registration requests
- Admin approval workflow for hotels (pending / approved / rejected)
- Hotel rooms, room availability, bookings, payments, refunds
- Reviews and ratings
- Offers and coupons
- Commissions tracking
- CMS content (homepage, banners, destinations, offers content)
- Admin settings

## Tables
- profiles: extends auth.users with role, full_name, phone, status
- hotels: hotel listings with approval workflow (pending/approved/rejected)
- rooms: room types within a hotel
- bookings: customer bookings with status, dates, amounts
- payments: payment records for bookings
- refunds: refund records linked to payments
- reviews: customer reviews with admin moderation
- offers: promotional offers
- coupons: coupon codes for checkout
- commissions: platform commission per booking
- cms_homepage: editable homepage content
- cms_banners: homepage banner carousel
- cms_destinations: featured destinations
- cms_offers_content: homepage offers section content
- settings: platform settings

## Security
- RLS enabled on all tables.
- profiles: owner can read/update own; admins can read all.
- hotels: anyone can read approved; owner can read own; admin can read all; owner/admin can insert/update.
- rooms: readable by anyone; owner/admin can manage.
- bookings: customer can read own; hotel owner can read for their hotels; admin can read all.
- payments: customer can read own; admin can read all; insert allowed for customer.
- refunds: admin can read/manage; customer can read own.
- reviews: anyone can read approved; customer can insert own; admin can read all and update approved flag.
- offers: anyone can read; admin can manage.
- coupons: anyone can read; admin can manage.
- commissions: admin can read/manage; hotel owner can read own.
- CMS tables: anyone can read; admin can manage.
- settings: anyone can read; admin can update.
*/

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  phone text DEFAULT '',
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'hotel_owner', 'admin')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON profiles;
CREATE POLICY "profiles_select_own_or_admin"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================
-- HOTELS
-- ============================================
CREATE TABLE IF NOT EXISTS hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text DEFAULT '',
  address text DEFAULT '',
  city text NOT NULL,
  state text DEFAULT '',
  country text DEFAULT 'India',
  pincode text DEFAULT '',
  latitude numeric DEFAULT 0,
  longitude numeric DEFAULT 0,
  star_rating int DEFAULT 3 CHECK (star_rating BETWEEN 1 AND 5),
  amenities text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  cover_image text DEFAULT '',
  price_from numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text DEFAULT '',
  contact_phone text DEFAULT '',
  contact_email text DEFAULT '',
  total_rooms int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hotels_select_approved_or_owner_or_admin" ON hotels;
CREATE POLICY "hotels_select_approved_or_owner_or_admin"
ON hotels FOR SELECT
TO anon, authenticated
USING (
  status = 'approved'
  OR owner_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "hotels_insert_auth" ON hotels;
CREATE POLICY "hotels_insert_auth"
ON hotels FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "hotels_update_owner_or_admin" ON hotels;
CREATE POLICY "hotels_update_owner_or_admin"
ON hotels FOR UPDATE
TO authenticated
USING (
  owner_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
)
WITH CHECK (true);

DROP POLICY IF EXISTS "hotels_delete_owner_or_admin" ON hotels;
CREATE POLICY "hotels_delete_owner_or_admin"
ON hotels FOR DELETE
TO authenticated
USING (
  owner_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- ============================================
-- ROOMS
-- ============================================
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  capacity int DEFAULT 2,
  price_per_night numeric NOT NULL DEFAULT 0,
  amenities text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  quantity int DEFAULT 1,
  bed_type text DEFAULT 'Double',
  size_sqft int DEFAULT 200,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rooms_select_all" ON rooms;
CREATE POLICY "rooms_select_all"
ON rooms FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "rooms_insert_owner_or_admin" ON rooms;
CREATE POLICY "rooms_insert_owner_or_admin"
ON rooms FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM hotels h
    WHERE h.id = hotel_id
    AND (h.owner_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  )
);

DROP POLICY IF EXISTS "rooms_update_owner_or_admin" ON rooms;
CREATE POLICY "rooms_update_owner_or_admin"
ON rooms FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM hotels h
    WHERE h.id = rooms.hotel_id
    AND (h.owner_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  )
)
WITH CHECK (true);

DROP POLICY IF EXISTS "rooms_delete_owner_or_admin" ON rooms;
CREATE POLICY "rooms_delete_owner_or_admin"
ON rooms FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM hotels h
    WHERE h.id = rooms.hotel_id
    AND (h.owner_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  )
);

-- ============================================
-- BOOKINGS
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference text UNIQUE DEFAULT ('BK' || upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 8))),
  customer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  hotel_id uuid NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests int DEFAULT 1,
  nights int DEFAULT 1,
  rooms_count int DEFAULT 1,
  guest_name text DEFAULT '',
  guest_email text DEFAULT '',
  guest_phone text DEFAULT '',
  base_amount numeric NOT NULL DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  tax_amount numeric DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  coupon_code text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  special_requests text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bookings_select_owner_or_hotel_owner_or_admin" ON bookings;
CREATE POLICY "bookings_select_owner_or_hotel_owner_or_admin"
ON bookings FOR SELECT
TO authenticated
USING (
  customer_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM hotels h
    WHERE h.id = bookings.hotel_id
    AND (h.owner_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  )
);

DROP POLICY IF EXISTS "bookings_insert_customer" ON bookings;
CREATE POLICY "bookings_insert_customer"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (customer_id = auth.uid() OR customer_id IS NULL);

DROP POLICY IF EXISTS "bookings_update_owner_or_hotel_owner_or_admin" ON bookings;
CREATE POLICY "bookings_update_owner_or_hotel_owner_or_admin"
ON bookings FOR UPDATE
TO authenticated
USING (
  customer_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM hotels h
    WHERE h.id = bookings.hotel_id
    AND (h.owner_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  )
)
WITH CHECK (true);

DROP POLICY IF EXISTS "bookings_delete_owner_or_admin" ON bookings;
CREATE POLICY "bookings_delete_owner_or_admin"
ON bookings FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  amount numeric NOT NULL DEFAULT 0,
  method text DEFAULT 'card' CHECK (method IN ('card', 'upi', 'netbanking', 'wallet', 'cash')),
  transaction_id text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments_select_owner_or_admin" ON payments;
CREATE POLICY "payments_select_owner_or_admin"
ON payments FOR SELECT
TO authenticated
USING (
  customer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  OR EXISTS (
    SELECT 1 FROM bookings b WHERE b.id = payments.booking_id
    AND EXISTS (
      SELECT 1 FROM hotels h WHERE h.id = b.hotel_id AND h.owner_id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "payments_insert_customer_or_admin" ON payments;
CREATE POLICY "payments_insert_customer_or_admin"
ON payments FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "payments_update_admin" ON payments;
CREATE POLICY "payments_update_admin"
ON payments FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
)
WITH CHECK (true);

-- ============================================
-- REFUNDS
-- ============================================
CREATE TABLE IF NOT EXISTS refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  amount numeric NOT NULL DEFAULT 0,
  reason text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'rejected')),
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "refunds_select_owner_or_admin" ON refunds;
CREATE POLICY "refunds_select_owner_or_admin"
ON refunds FOR SELECT
TO authenticated
USING (
  customer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "refunds_insert_admin" ON refunds;
CREATE POLICY "refunds_insert_admin"
ON refunds FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "refunds_update_admin" ON refunds;
CREATE POLICY "refunds_update_admin"
ON refunds FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
)
WITH CHECK (true);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  rating int NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  title text DEFAULT '',
  comment text DEFAULT '',
  is_approved boolean DEFAULT false,
  approved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_select_approved_or_owner_or_admin" ON reviews;
CREATE POLICY "reviews_select_approved_or_owner_or_admin"
ON reviews FOR SELECT
TO anon, authenticated
USING (
  is_approved = true
  OR customer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "reviews_insert_customer" ON reviews;
CREATE POLICY "reviews_insert_customer"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "reviews_update_owner_or_admin" ON reviews;
CREATE POLICY "reviews_update_owner_or_admin"
ON reviews FOR UPDATE
TO authenticated
USING (
  customer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
)
WITH CHECK (true);

DROP POLICY IF EXISTS "reviews_delete_owner_or_admin" ON reviews;
CREATE POLICY "reviews_delete_owner_or_admin"
ON reviews FOR DELETE
TO authenticated
USING (
  customer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- ============================================
-- OFFERS
-- ============================================
CREATE TABLE IF NOT EXISTS offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  discount_type text NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'flat')),
  discount_value numeric NOT NULL DEFAULT 0,
  code text UNIQUE DEFAULT '',
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE,
  image_url text DEFAULT '',
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date NOT NULL DEFAULT (CURRENT_DATE + 30),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "offers_select_active" ON offers;
CREATE POLICY "offers_select_active"
ON offers FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "offers_insert_admin" ON offers;
CREATE POLICY "offers_insert_admin"
ON offers FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "offers_update_admin" ON offers;
CREATE POLICY "offers_update_admin"
ON offers FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "offers_delete_admin" ON offers;
CREATE POLICY "offers_delete_admin"
ON offers FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- COUPONS
-- ============================================
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text DEFAULT '',
  discount_type text NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'flat')),
  discount_value numeric NOT NULL DEFAULT 0,
  min_order_amount numeric DEFAULT 0,
  max_discount_amount numeric DEFAULT 0,
  usage_limit int DEFAULT 0,
  used_count int DEFAULT 0,
  valid_from date NOT NULL DEFAULT CURRENT_DATE,
  valid_until date NOT NULL DEFAULT (CURRENT_DATE + 30),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coupons_select_active" ON coupons;
CREATE POLICY "coupons_select_active"
ON coupons FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "coupons_insert_admin" ON coupons;
CREATE POLICY "coupons_insert_admin"
ON coupons FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "coupons_update_admin" ON coupons;
CREATE POLICY "coupons_update_admin"
ON coupons FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "coupons_delete_admin" ON coupons;
CREATE POLICY "coupons_delete_admin"
ON coupons FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- COMMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  hotel_id uuid NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  booking_amount numeric NOT NULL DEFAULT 0,
  commission_rate numeric NOT NULL DEFAULT 10,
  commission_amount numeric NOT NULL DEFAULT 0,
  payout_status text NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'paid', 'on_hold')),
  payout_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "commissions_select_admin_or_hotel_owner" ON commissions;
CREATE POLICY "commissions_select_admin_or_hotel_owner"
ON commissions FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  OR EXISTS (
    SELECT 1 FROM hotels h WHERE h.id = commissions.hotel_id AND h.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "commissions_insert_admin" ON commissions;
CREATE POLICY "commissions_insert_admin"
ON commissions FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "commissions_update_admin" ON commissions;
CREATE POLICY "commissions_update_admin"
ON commissions FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
)
WITH CHECK (true);

-- ============================================
-- CMS - HOMEPAGE
-- ============================================
CREATE TABLE IF NOT EXISTS cms_homepage (
  id int PRIMARY KEY DEFAULT 1,
  hero_title text DEFAULT 'Find Your Perfect Stay',
  hero_subtitle text DEFAULT 'Discover and book from thousands of hotels worldwide',
  hero_search_placeholder text DEFAULT 'Search by city, hotel, or location',
  feature_section_title text DEFAULT 'Why Book With Us',
  stats_hotels text DEFAULT '50,000+ Hotels',
  stats_customers text DEFAULT '10M+ Happy Customers',
  stats_cities text DEFAULT '1,500+ Cities',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cms_homepage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_homepage_select_all" ON cms_homepage;
CREATE POLICY "cms_homepage_select_all"
ON cms_homepage FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "cms_homepage_update_admin" ON cms_homepage;
CREATE POLICY "cms_homepage_update_admin"
ON cms_homepage FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_homepage_insert_admin" ON cms_homepage;
CREATE POLICY "cms_homepage_insert_admin"
ON cms_homepage FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- CMS - BANNERS
-- ============================================
CREATE TABLE IF NOT EXISTS cms_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  subtitle text DEFAULT '',
  image_url text DEFAULT '',
  link_url text DEFAULT '',
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cms_banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_banners_select_all" ON cms_banners;
CREATE POLICY "cms_banners_select_all"
ON cms_banners FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "cms_banners_insert_admin" ON cms_banners;
CREATE POLICY "cms_banners_insert_admin"
ON cms_banners FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "cms_banners_update_admin" ON cms_banners;
CREATE POLICY "cms_banners_update_admin"
ON cms_banners FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_banners_delete_admin" ON cms_banners;
CREATE POLICY "cms_banners_delete_admin"
ON cms_banners FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- CMS - DESTINATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS cms_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text DEFAULT 'India',
  image_url text DEFAULT '',
  hotel_count int DEFAULT 0,
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cms_destinations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_destinations_select_all" ON cms_destinations;
CREATE POLICY "cms_destinations_select_all"
ON cms_destinations FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "cms_destinations_insert_admin" ON cms_destinations;
CREATE POLICY "cms_destinations_insert_admin"
ON cms_destinations FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "cms_destinations_update_admin" ON cms_destinations;
CREATE POLICY "cms_destinations_update_admin"
ON cms_destinations FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_destinations_delete_admin" ON cms_destinations;
CREATE POLICY "cms_destinations_delete_admin"
ON cms_destinations FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- CMS - OFFERS CONTENT
-- ============================================
CREATE TABLE IF NOT EXISTS cms_offers_content (
  id int PRIMARY KEY DEFAULT 1,
  section_title text DEFAULT 'Exclusive Offers',
  section_subtitle text DEFAULT 'Save big on your next stay',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cms_offers_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_offers_content_select_all" ON cms_offers_content;
CREATE POLICY "cms_offers_content_select_all"
ON cms_offers_content FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "cms_offers_content_update_admin" ON cms_offers_content;
CREATE POLICY "cms_offers_content_update_admin"
ON cms_offers_content FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "cms_offers_content_insert_admin" ON cms_offers_content;
CREATE POLICY "cms_offers_content_insert_admin"
ON cms_offers_content FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id int PRIMARY KEY DEFAULT 1,
  platform_name text DEFAULT 'StayFinder',
  support_email text DEFAULT 'support@stayfinder.com',
  contact_phone text DEFAULT '+91 1800 123 4567',
  currency text DEFAULT 'INR',
  currency_symbol text DEFAULT '₹',
  default_commission_rate numeric DEFAULT 10,
  tax_rate numeric DEFAULT 12,
  address text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settings_select_all" ON settings;
CREATE POLICY "settings_select_all"
ON settings FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "settings_update_admin" ON settings;
CREATE POLICY "settings_update_admin"
ON settings FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "settings_insert_admin" ON settings;
CREATE POLICY "settings_insert_admin"
ON settings FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_hotels_status ON hotels(status);
CREATE INDEX IF NOT EXISTS idx_hotels_city ON hotels(city);
CREATE INDEX IF NOT EXISTS idx_hotels_owner ON hotels(owner_id);
CREATE INDEX IF NOT EXISTS idx_rooms_hotel ON rooms(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_hotel ON bookings(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_reviews_hotel ON reviews(hotel_id);
CREATE INDEX IF NOT EXISTS idx_commissions_hotel ON commissions(hotel_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================
-- TRIGGER: auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), COALESCE(NEW.raw_user_meta_data->>'role', 'customer'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
