import client from './client'

const offersApi = {
  getAll:  ()         => client.get('/api/admin/offers'),
  create:  (body)     => client.post('/api/admin/offers', body),
  update:  (id, body) => client.patch(`/api/admin/offers/${id}`, body),
  delete:  (id)       => client.delete(`/api/admin/offers/${id}`),
  toggle:  (id)       => client.patch(`/api/admin/offers/${id}/toggle`),
}

export default offersApi
