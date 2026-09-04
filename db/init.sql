-- Users (all personas stored here, differentiated by role)
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  phone       VARCHAR(20),
  role        VARCHAR(20) NOT NULL DEFAULT 'customer', -- customer | hotel_owner | admin
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Admins (separate table for admin portal login)
CREATE TABLE IF NOT EXISTS admins (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hotels
CREATE TABLE IF NOT EXISTS hotels (
  id          SERIAL PRIMARY KEY,
  owner_id    INT REFERENCES users(id),
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  city        VARCHAR(100),
  address     TEXT,
  amenities   TEXT[],
  images      TEXT[],
  status      VARCHAR(20) DEFAULT 'pending', -- pending | approved | rejected | suspended
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Hotel extra detail columns (added for dynamic detail page)
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS star_rating       INT DEFAULT 3;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS state             VARCHAR(100);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS latitude          NUMERIC(10,7);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS longitude         NUMERIC(10,7);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS check_in_time     VARCHAR(20) DEFAULT '12:00 PM';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS check_out_time    VARCHAR(20) DEFAULT '11:00 AM';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS cancellation_policy TEXT DEFAULT 'Free cancellation up to 24 hours before check-in.';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS pets_allowed      BOOLEAN DEFAULT FALSE;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS smoking_allowed   BOOLEAN DEFAULT FALSE;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS breakfast_included BOOLEAN DEFAULT FALSE;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS is_open BOOLEAN DEFAULT TRUE;

-- White-label / landing page columns
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS brand_name           VARCHAR(200);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS brand_tagline        VARCHAR(200);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS logo_text            VARCHAR(5);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS logo_url             TEXT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS theme                VARCHAR(30) DEFAULT 'emerald';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS cover_image          TEXT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS landing_page_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS contact_email        VARCHAR(150);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS contact_phone        VARCHAR(30);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS hero_heading         TEXT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS hero_subheading      TEXT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS feature1_title       VARCHAR(200);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS feature1_desc        TEXT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS feature2_title       VARCHAR(200);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS feature2_desc        TEXT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS feature3_title       VARCHAR(200);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS feature3_desc        TEXT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS feature4_title       VARCHAR(200);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS feature4_desc        TEXT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS cta_heading          TEXT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS cta_subheading       TEXT;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS footer_tagline       TEXT;

-- Rooms
CREATE TABLE IF NOT EXISTS rooms (
  id               SERIAL PRIMARY KEY,
  hotel_id         INT REFERENCES hotels(id) ON DELETE CASCADE,
  room_number      VARCHAR(20),
  room_type        VARCHAR(50),
  price_per_night  NUMERIC(10,2),
  capacity         INT DEFAULT 2,
  amenities        TEXT[],
  images           TEXT[] DEFAULT '{}',
  is_available     BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id                 SERIAL PRIMARY KEY,
  user_id            INT REFERENCES users(id),
  hotel_id           INT REFERENCES hotels(id),
  room_id            INT REFERENCES rooms(id),
  owner_id           INT REFERENCES users(id),
  checkin_date       DATE NOT NULL,
  checkout_date      DATE NOT NULL,
  guests             INT DEFAULT 1,
  amount             NUMERIC(10,2),
  customer_name      VARCHAR(150),
  customer_email     VARCHAR(150),
  customer_phone     VARCHAR(30),
  booking_reference  VARCHAR(50),
  source             VARCHAR(30) DEFAULT 'main_site', -- main_site | landing_page
  status             VARCHAR(20) DEFAULT 'pending', -- pending | confirmed | checked_in | checked_out | cancelled
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Add new booking columns to existing tables (safe for existing DBs)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS owner_id          INT REFERENCES users(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_name     VARCHAR(150);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_email    VARCHAR(150);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_phone    VARCHAR(30);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_reference VARCHAR(50);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS source            VARCHAR(30) DEFAULT 'main_site';

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id          SERIAL PRIMARY KEY,
  booking_id  INT REFERENCES bookings(id),
  amount      NUMERIC(10,2),
  method      VARCHAR(50),
  status      VARCHAR(20) DEFAULT 'pending', -- pending | completed | refunded
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id),
  hotel_id    INT REFERENCES hotels(id),
  booking_id  INT REFERENCES bookings(id),
  rating      INT CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_hotels_status_open   ON hotels(status, is_open);
CREATE INDEX IF NOT EXISTS idx_hotels_city          ON hotels(LOWER(city));
CREATE INDEX IF NOT EXISTS idx_rooms_hotel_id       ON rooms(hotel_id);
CREATE INDEX IF NOT EXISTS idx_rooms_hotel_avail    ON rooms(hotel_id, is_available);
CREATE INDEX IF NOT EXISTS idx_reviews_hotel_id     ON reviews(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id     ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_hotel_id    ON bookings(hotel_id);

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id              SERIAL PRIMARY KEY,
  code            VARCHAR(50) UNIQUE NOT NULL,
  discount_type   VARCHAR(20) NOT NULL, -- percent | flat
  discount_value  NUMERIC(10,2),
  min_amount      NUMERIC(10,2) DEFAULT 0,
  expires_at      TIMESTAMPTZ,
  max_uses        INT DEFAULT 100,
  uses            INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default admin
INSERT INTO admins (name, email, password)
VALUES ('Super Admin', 'admin@hotelzilla.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT DO NOTHING;
-- default password: password

-- Seed default hotel owner (password: partner123)
INSERT INTO users (name, email, password, phone, role)
VALUES ('Ravi Sharma', 'partner@hotelzilla.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+91 9876543210', 'hotel_owner')
ON CONFLICT DO NOTHING;
-- default password: password

-- CMS: Homepage content (key-value JSON blob per section)
CREATE TABLE IF NOT EXISTS cms_content (
  section     VARCHAR(50) PRIMARY KEY,
  data        JSONB NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- CMS: Featured destinations shown on landing page
CREATE TABLE IF NOT EXISTS cms_destinations (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  country        VARCHAR(100) DEFAULT 'India',
  image_url      TEXT,
  hotel_count    INT DEFAULT 0,
  display_order  INT DEFAULT 0,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- CMS: Promotional offer banners shown on landing page
CREATE TABLE IF NOT EXISTS cms_offers (
  id             SERIAL PRIMARY KEY,
  title          VARCHAR(200) NOT NULL,
  description    TEXT,
  code           VARCHAR(50),
  image_url      TEXT,
  display_order  INT DEFAULT 0,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
