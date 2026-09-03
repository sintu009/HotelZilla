import client from './client'

const dashboardApi = {
  getStats: () => client.get('/api/admin/dashboard/stats'),
}

export default dashboardApi
