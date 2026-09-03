import client from './client'

const couponsApi = {
  getAll:  ()         => client.get('/api/admin/coupons'),
  create:  (body)     => client.post('/api/admin/coupons', body),
  update:  (id, body) => client.patch(`/api/admin/coupons/${id}`, body),
  delete:  (id)       => client.delete(`/api/admin/coupons/${id}`),
}

export default couponsApi
