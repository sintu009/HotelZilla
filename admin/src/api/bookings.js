import client from './client'

const bookingsApi = {
  getAll:    (params = {}) => client.get(`/api/admin/bookings?${new URLSearchParams(params)}`),
  getById:   (id)          => client.get(`/api/admin/bookings/${id}`),
  cancel:    (id)          => client.patch(`/api/admin/bookings/${id}/cancel`),
  complete:  (id)          => client.patch(`/api/admin/bookings/${id}/complete`),
}

export default bookingsApi
