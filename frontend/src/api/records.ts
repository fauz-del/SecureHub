import client from './client'

export const getRecords = async (page = 1, limit = 20) => {
  const res = await client.get(`/records?page=${page}&limit=${limit}`)
  return res.data
}

export const getStats = async () => {
  const res = await client.get('/records/stats')
  return res.data
}

export const createRecord = async (data: any) => {
  const res = await client.post('/records', data)
  return res.data
}

export const updateRecord = async (id: number, data: any) => {
  const res = await client.put(`/records/${id}`, data)
  return res.data
}

export const deleteRecord = async (id: number) => {
  const res = await client.delete(`/records/${id}`)
  return res.data
}
