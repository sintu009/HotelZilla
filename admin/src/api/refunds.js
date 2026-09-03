import client from './client'

const refundsApi = {
  getAll:  (params = {}) => client.get(`/api/admin/refunds?${new URLSearchParams(params)}`),
  process: (id)          => client.patch(`/api/admin/refunds/${id}/process`),
  reject:  (id)          => client.patch(`/api/admin/refunds/${id}/reject`),
}

export default refundsApi
