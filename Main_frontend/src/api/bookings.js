import client from './client'

const bookingsApi = {
  create:    (body) => client.post('/api/bookings', body),
  getMyAll:  ()     => client.get('/api/bookings/my'),
  getById:   (id)   => client.get(`/api/bookings/${id}`),
  cancel:    (id)   => client.patch(`/api/bookings/${id}/cancel`),
  validateCoupon: (code, amount) => client.post('/api/coupons/validate', { code, amount }),
}

export default bookingsApi
