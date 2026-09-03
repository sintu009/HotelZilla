const { z } = require("zod");

const idParam = z.object({ id: z.coerce.number().int().positive() });

const adminLogin = {
  body: z.object({
    email:    z.string().email(),
    password: z.string().min(6),
  }),
};

const updateHotelStatus = {
  params: idParam,
  body: z.object({
    status: z.enum(["approved", "rejected", "suspended"]),
  }),
};

const updateBookingStatus = {
  params: idParam,
  body: z.object({
    status: z.enum(["pending", "confirmed", "checked_in", "checked_out", "cancelled"]),
  }),
};

const createCoupon = {
  body: z.object({
    code:           z.string().min(3).max(50).toUpperCase(),
    discount_type:  z.enum(["percent", "flat"]),
    discount_value: z.number().positive(),
    min_amount:     z.number().min(0).default(0),
    expires_at:     z.string().datetime(),
    max_uses:       z.number().int().positive().default(100),
  }),
};

const paginationQuery = {
  query: z.object({
    page:  z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

module.exports = { adminLogin, updateHotelStatus, updateBookingStatus, createCoupon, paginationQuery, idParam };
