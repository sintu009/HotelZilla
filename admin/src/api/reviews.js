import client from './client'

const reviewsApi = {
  getAll:    (params = {}) => client.get(`/api/admin/reviews?${new URLSearchParams(params)}`),
  approve:   (id)          => client.patch(`/api/admin/reviews/${id}/approve`),
  unapprove: (id)          => client.patch(`/api/admin/reviews/${id}/unapprove`),
  delete:    (id)          => client.delete(`/api/admin/reviews/${id}`),
}

export default reviewsApi
