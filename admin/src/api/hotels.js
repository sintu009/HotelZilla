import client from './client'

const hotelsApi = {
  getAll:  (params = {}) => client.get(`/api/admin/hotels?${new URLSearchParams(params)}`),
  getById: (id)          => client.get(`/api/admin/hotels/${id}`),
  create:  (body)        => client.post('/api/admin/hotels', body),
  update:  (id, body)    => client.patch(`/api/admin/hotels/${id}`, body),
  approve: (id)          => client.patch(`/api/admin/hotels/${id}/approve`),
  reject:  (id, reason)  => client.patch(`/api/admin/hotels/${id}/reject`, { reason }),
  delete:  (id)          => client.delete(`/api/admin/hotels/${id}`),
}

export default hotelsApi
