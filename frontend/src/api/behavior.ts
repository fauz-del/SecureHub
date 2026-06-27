import client from './client'
import { BehaviorEvent } from '../types'

export const flushEvents = async (events: BehaviorEvent[]) => {
  if (events.length === 0) return
  await client.post('/behavior/batch', { events })
}

export const getFrictionReport = async () => {
  const res = await client.get('/behavior/report')
  return res.data
}
