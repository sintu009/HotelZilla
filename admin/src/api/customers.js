import client from './client'

const customersApi = {
  getAll:   (params = {}) => client.get(`/api/admin/customers?${new URLSearchParams(params)}`),
  getById:  (id)          => client.get(`/api/admin/customers/${id}`),
  suspend:  (id)          => client.patch(`/api/admin/customers/${id}/suspend`),
  activate: (id)          => client.patch(`/api/admin/customers/${id}/activate`),
}

export default customersApi
