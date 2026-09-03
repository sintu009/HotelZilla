const { z } = require("zod");

const idParam    = z.object({ id: z.coerce.number().int().positive() });
const hotelParam = z.object({ hotel_id: z.coerce.number().int().positive() });

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

const createHotel = {
  body: z.object({
    name:        z.string().min(3).max(200),
    description: z.string().max(2000).optional(),
    city:        z.string().min(2).max(100),
    address:     z.string().min(5).max(300),
    amenities:   z.array(z.string()).default([]),
    images:      z.array(z.string().url()).default([]),
  }),
};

const updateHotel = {
  params: idParam,
  body: createHotel.body.partial(),
};

const addRoom = {
  params: hotelParam,
  body: z.object({
    room_number:     z.string().min(1).max(20),
    room_type:       z.string().min(2).max(50),
    price_per_night: z.number().positive(),
    capacity:        z.number().int().min(1).max(20),
    amenities:       z.array(z.string()).default([]),
  }),
};

const updateRoom = {
  params: idParam,
  body: z.object({
    price_per_night: z.number().positive().optional(),
    is_available:    z.boolean().optional(),
    amenities:       z.array(z.string()).optional(),
  }),
};

const updateBookingStatus = {
  params: idParam,
  body: z.object({
    status: z.enum(["confirmed", "checked_in", "checked_out", "cancelled"]),
  }),
};

module.exports = { register, login, createHotel, updateHotel, addRoom, updateRoom, updateBookingStatus, idParam, hotelParam };
