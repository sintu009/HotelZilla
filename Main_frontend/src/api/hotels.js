import client from './client'

const hotelsApi = {
  search:    (params = {}) => client.get(`/api/hotels?${new URLSearchParams(params)}`),
  getById:   (id)          => client.get(`/api/hotels/${id}`),
  getRooms:  (id)          => client.get(`/api/hotels/${id}/rooms`),
  getReviews:(id)          => client.get(`/api/hotels/${id}/reviews`),
  register:  (body)        => client.post('/api/hotels/register', body),
}

export default hotelsApi
