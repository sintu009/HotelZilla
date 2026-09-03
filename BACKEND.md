# HotelZilla — Backend Microservices

## Architecture Overview

```
HotelZilla/
├── services/
│   ├── gateway/           → API Gateway (port 4000) — single entry point
│   ├── admin-service/     → Admin Portal Backend (port 4001)
│   ├── user-service/      → Customer/Frontend Backend (port 4002)
│   ├── hotel-service/     → Hotel Partner Backend (port 4003)
│   └── realtime-service/  → WebSocket Service (port 4004)
├── db/
│   └── init.sql           → PostgreSQL schema + seed
├── docker-compose.yml
└── BACKEND.md
```

All HTTP traffic flows through the **gateway** on port `4000`.
Real-time (WebSocket) connects directly to **realtime-service** on port `4004`.

---

## How to Run

```bash
# 1. Copy env file (optional, defaults work for local dev)
cp services/admin-service/.env.example services/admin-service/.env

# 2. Build and start all services
docker-compose up --build

# 3. Stop all services
docker-compose down

# 4. Wipe DB volume too
docker-compose down -v
```

---

## Services

---

### 1. Gateway — `port 4000`

Routes all API requests to the correct microservice.

| Prefix         | Forwarded To    |
|----------------|-----------------|
| `/api/admin/*` | admin-service   |
| `/api/partner/*` | hotel-service |
| `/api/*`       | user-service    |

**Health check:** `GET /health`

---

### 2. Admin Service — `port 4001`

Handles everything the **admin portal** needs.

#### Auth
| Method | Endpoint              | Description         | Auth |
|--------|-----------------------|---------------------|------|
| POST   | `/api/admin/auth/login` | Admin login → JWT | No   |

#### Dashboard
| Method | Endpoint                    | Description                              | Auth |
|--------|-----------------------------|------------------------------------------|------|
| GET    | `/api/admin/dashboard/stats` | Total bookings, hotels, customers, revenue | Yes |

#### Hotels Management
| Method | Endpoint                        | Description                        | Auth |
|--------|---------------------------------|------------------------------------|------|
| GET    | `/api/admin/hotels`             | List all hotels with owner info    | Yes  |
| PATCH  | `/api/admin/hotels/:id/status`  | Approve / reject / suspend hotel   | Yes  |

Body for status update:
```json
{ "status": "approved" }   // approved | rejected | suspended
```

#### Bookings Management
| Method | Endpoint                          | Description              | Auth |
|--------|-----------------------------------|--------------------------|------|
| GET    | `/api/admin/bookings`             | All bookings platform-wide | Yes |
| PATCH  | `/api/admin/bookings/:id/status`  | Update booking status    | Yes  |

#### Customers Management
| Method | Endpoint                           | Description              | Auth |
|--------|------------------------------------|--------------------------|------|
| GET    | `/api/admin/customers`             | List all customers       | Yes  |
| PATCH  | `/api/admin/customers/:id/toggle`  | Ban / unban customer     | Yes  |

#### Payments & Refunds
| Method | Endpoint                          | Description           | Auth |
|--------|-----------------------------------|-----------------------|------|
| GET    | `/api/admin/payments`             | All payments          | Yes  |
| POST   | `/api/admin/payments/:id/refund`  | Mark payment refunded | Yes  |

#### Coupons
| Method | Endpoint                    | Description       | Auth |
|--------|-----------------------------|-------------------|------|
| GET    | `/api/admin/coupons`        | List all coupons  | Yes  |
| POST   | `/api/admin/coupons`        | Create coupon     | Yes  |
| DELETE | `/api/admin/coupons/:id`    | Delete coupon     | Yes  |

Create coupon body:
```json
{
  "code": "SAVE20",
  "discount_type": "percent",
  "discount_value": 20,
  "min_amount": 500,
  "expires_at": "2025-12-31T00:00:00Z",
  "max_uses": 200
}
```

#### Reviews Moderation
| Method | Endpoint                    | Description       | Auth |
|--------|-----------------------------|-------------------|------|
| GET    | `/api/admin/reviews`        | All reviews       | Yes  |
| DELETE | `/api/admin/reviews/:id`    | Remove review     | Yes  |

---

### 3. User Service — `port 4002`

Handles everything the **customer-facing frontend** needs.

#### Auth
| Method | Endpoint             | Description              | Auth |
|--------|----------------------|--------------------------|------|
| POST   | `/api/auth/register` | Register new customer    | No   |
| POST   | `/api/auth/login`    | Login → JWT              | No   |

Register body:
```json
{ "name": "John", "email": "john@example.com", "password": "pass123", "phone": "9999999999" }
```

#### Hotel Search & Listing
| Method | Endpoint           | Description                              | Auth |
|--------|--------------------|------------------------------------------|------|
| GET    | `/api/hotels`      | Search hotels (filter by city, guests)   | No   |
| GET    | `/api/hotels/:id`  | Hotel detail with rooms + reviews        | No   |

Query params for search: `?city=Mumbai&checkin=2025-01-10&checkout=2025-01-12&guests=2`

#### Bookings
| Method | Endpoint                    | Description              | Auth |
|--------|-----------------------------|--------------------------|------|
| POST   | `/api/bookings`             | Create booking           | Yes  |
| GET    | `/api/bookings/my`          | My bookings              | Yes  |
| PATCH  | `/api/bookings/:id/cancel`  | Cancel booking           | Yes  |

Create booking body:
```json
{
  "hotel_id": 1,
  "room_id": 3,
  "checkin_date": "2025-02-10",
  "checkout_date": "2025-02-13",
  "guests": 2,
  "coupon_code": "SAVE20"
}
```

#### Reviews
| Method | Endpoint       | Description         | Auth |
|--------|----------------|---------------------|------|
| POST   | `/api/reviews` | Submit hotel review | Yes  |

Body:
```json
{ "hotel_id": 1, "booking_id": 5, "rating": 4, "comment": "Great stay!" }
```

---

### 4. Hotel Service — `port 4003`

Handles everything the **hotel partner portal** needs.

#### Auth
| Method | Endpoint                  | Description                | Auth |
|--------|---------------------------|----------------------------|------|
| POST   | `/api/partner/auth/register` | Register as hotel owner | No   |
| POST   | `/api/partner/auth/login`    | Login → JWT             | No   |

#### My Hotels
| Method | Endpoint                          | Description                  | Auth |
|--------|-----------------------------------|------------------------------|------|
| GET    | `/api/partner/hotels`             | List my hotels               | Yes  |
| POST   | `/api/partner/hotels`             | Register new hotel           | Yes  |
| PUT    | `/api/partner/hotels/:id`         | Update hotel info            | Yes  |

Create hotel body:
```json
{
  "name": "Grand Palace",
  "description": "Luxury hotel in the heart of the city",
  "city": "Mumbai",
  "address": "123 Marine Drive",
  "amenities": ["WiFi", "Pool", "Gym"],
  "images": ["https://..."]
}
```

#### Rooms
| Method | Endpoint                                  | Description       | Auth |
|--------|-------------------------------------------|-------------------|------|
| GET    | `/api/partner/hotels/:hotel_id/rooms`     | List rooms        | Yes  |
| POST   | `/api/partner/hotels/:hotel_id/rooms`     | Add room          | Yes  |
| PUT    | `/api/partner/hotels/rooms/:id`           | Update room       | Yes  |

Add room body:
```json
{
  "room_number": "101",
  "room_type": "Deluxe",
  "price_per_night": 2500,
  "capacity": 2,
  "amenities": ["AC", "TV", "Mini Bar"]
}
```

#### Bookings (incoming)
| Method | Endpoint                              | Description                    | Auth |
|--------|---------------------------------------|--------------------------------|------|
| GET    | `/api/partner/bookings`               | All bookings for my hotels     | Yes  |
| PATCH  | `/api/partner/bookings/:id/status`    | Confirm / check-in / check-out | Yes  |

Status values: `confirmed` | `checked_in` | `checked_out`

#### Earnings
| Method | Endpoint                  | Description                    | Auth |
|--------|---------------------------|--------------------------------|------|
| GET    | `/api/partner/earnings`   | Monthly earnings breakdown     | Yes  |

Response includes gross amount and net (after 10% platform commission).

---

### 5. Realtime Service — `port 4004` (WebSocket)

Uses **Socket.IO**. Connect with a JWT token in the auth handshake.

#### Connection
```js
import { io } from "socket.io-client";

const socket = io("http://localhost:4004", {
  auth: { token: "<JWT_TOKEN>" }
});
```

#### Events

| Event (emit)      | Payload                                      | Description                        |
|-------------------|----------------------------------------------|------------------------------------|
| `join_room`       | `roomId: string`                             | Join a chat/booking room           |
| `send_message`    | `{ roomId, message }`                        | Send message to a room             |
| `notify_user`     | `{ targetUserId, notification }`             | Push notification to specific user |
| `booking_update`  | `{ bookingId, status }`                      | Broadcast booking status change    |

| Event (listen)    | Payload                                      | Description                        |
|-------------------|----------------------------------------------|------------------------------------|
| `new_message`     | `{ from, message, timestamp }`               | Receive message in room            |
| `notification`    | `{ title, body, ... }`                       | Receive push notification          |
| `booking_<id>`    | `{ status }`                                 | Booking status update              |

#### Use Cases
- **Customer ↔ Hotel chat** — both join `room_<bookingId>`, exchange messages
- **Admin notifications** — admin joins `room_admin`, receives alerts
- **Booking status live update** — frontend listens to `booking_<id>` for real-time status

---

## Database Schema

All services share one PostgreSQL database (`hotelzilla`).

| Table      | Purpose                                      |
|------------|----------------------------------------------|
| `users`    | Customers + hotel owners (role-based)        |
| `admins`   | Admin portal accounts                        |
| `hotels`   | Hotel listings                               |
| `rooms`    | Rooms per hotel                              |
| `bookings` | Booking records                              |
| `payments` | Payment records linked to bookings           |
| `reviews`  | Customer reviews per hotel                   |
| `coupons`  | Discount coupons                             |

Schema is auto-created on first `docker-compose up` via `db/init.sql`.

Default admin credentials:
- Email: `admin@hotelzilla.com`
- Password: `password`

---

## Environment Variables

Each service reads from environment (set in `docker-compose.yml`):

| Variable       | Description                  | Default       |
|----------------|------------------------------|---------------|
| `PORT`         | Service port                 | per service   |
| `DB_HOST`      | Postgres host                | `postgres`    |
| `DB_USER`      | Postgres user                | `postgres`    |
| `DB_PASSWORD`  | Postgres password            | `postgres`    |
| `DB_NAME`      | Database name                | `hotelzilla`  |
| `JWT_SECRET`   | JWT signing secret           | `supersecret` |

---

## Port Map

| Service          | Port  |
|------------------|-------|
| Gateway          | 4000  |
| Admin Service    | 4001  |
| User Service     | 4002  |
| Hotel Service    | 4003  |
| Realtime Service | 4004  |
| PostgreSQL       | 5432  |

---

## Frontend API Base URLs

| Portal         | Base URL                    |
|----------------|-----------------------------|
| Admin Portal   | `http://localhost:4000/api/admin` |
| Customer App   | `http://localhost:4000/api`       |
| Hotel Partner  | `http://localhost:4000/api/partner` |
| WebSocket      | `ws://localhost:4004`             |
