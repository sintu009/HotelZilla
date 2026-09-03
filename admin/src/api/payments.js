import client from './client'

const paymentsApi = {
  getAll:  (params = {}) => client.get(`/api/admin/payments?${new URLSearchParams(params)}`),
  getById: (id)          => client.get(`/api/admin/payments/${id}`),
}

export default paymentsApi
