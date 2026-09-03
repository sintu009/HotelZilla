import client from './client'

const hotelOwnersApi = {
  getAll:   (params = {}) => client.get(`/api/admin/hotel-owners?${new URLSearchParams(params)}`),
  getById:  (id)          => client.get(`/api/admin/hotel-owners/${id}`),
  suspend:  (id)          => client.patch(`/api/admin/hotel-owners/${id}/suspend`),
  activate: (id)          => client.patch(`/api/admin/hotel-owners/${id}/activate`),
}

export default hotelOwnersApi
