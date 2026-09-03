import client from './client'

const commissionsApi = {
  getAll:     (params = {}) => client.get(`/api/admin/commissions?${new URLSearchParams(params)}`),
  markPaid:   (id)          => client.patch(`/api/admin/commissions/${id}/pay`),
  markOnHold: (id)          => client.patch(`/api/admin/commissions/${id}/hold`),
}

export default commissionsApi
