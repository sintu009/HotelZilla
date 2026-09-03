const { z } = require("zod");

const idParam = z.object({ id: z.coerce.number().int().positive() });

const register = {
  body: z.object({
    name:     z.string().min(2).max(100),
    email:    z.string().email(),
    password: z.string().min(8).max(72),
    phone:    z.string().regex(/^\+?[0-9]{7,15}$/).optional(),
  }),
};

const login = {
  body: z.object({
    email:    z.string().email(),
    password: z.string().min(1),
  }),
};

const searchHotels = {
  query: z.object({
    city:     z.string().min(1).optional(),
    checkin:  z.string().date().optional(),
    checkout: z.string().date().optional(),
    guests:   z.coerce.number().int().positive().optional(),
    page:     z.coerce.number().int().positive().default(1),
    limit:    z.coerce.number().int().min(1).max(50).default(12),
  }),
};

const createBooking = {
  body: z.object({
    hotel_id:      z.number().int().positive(),
    room_id:       z.number().int().positive(),
    checkin_date:  z.string().date(),
    checkout_date: z.string().date(),
    guests:        z.number().int().min(1).max(20),
    coupon_code:   z.string().optional(),
  }).refine((d) => new Date(d.checkout_date) > new Date(d.checkin_date), {
    message: "checkout_date must be after checkin_date",
    path: ["checkout_date"],
  }),
};

const addReview = {
  body: z.object({
    hotel_id:   z.number().int().positive(),
    booking_id: z.number().int().positive(),
    rating:     z.number().int().min(1).max(5),
    comment:    z.string().min(5).max(1000).optional(),
  }),
};

module.exports = { register, login, searchHotels, createBooking, addReview, idParam };
