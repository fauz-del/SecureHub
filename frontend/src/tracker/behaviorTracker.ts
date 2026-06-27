import { flushEvents } from '../api/behavior'
import { BehaviorEvent } from '../types'

const SESSION_ID = `sess_${Math.random().toString(36).substring(2, 9)}`
let eventQueue: BehaviorEvent[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null
let clickMap: Map<string, number[]> = new Map()

const getElementId = (el: HTMLElement): string => {
  if (el.id) return `#${el.id}`
  if (el.className) return `.${el.className.toString().split(' ')[0]}`
  return el.tagName.toLowerCase()
}

const queueEvent = (element_id: string, event_type: 'rage_click' | 'input_abandon') => {
  eventQueue.push({
    session_id: SESSION_ID,
    element_id,
    event_type,
    timestamp: new Date().toISOString()
  })
  scheduleFlush()
}

const scheduleFlush = () => {
  if (flushTimer) clearTimeout(flushTimer)
  flushTimer = setTimeout(flush, 3000)
}

const flush = async () => {
  if (eventQueue.length === 0) return
  const toSend = [...eventQueue]
  eventQueue = []
  try {
    await flushEvents(toSend)
  } catch {
    eventQueue = [...toSend, ...eventQueue]
  }
}

const handleClick = (e: MouseEvent) => {
  const el = e.target as HTMLElement
  const id = getElementId(el)
  const now = Date.now()
  const times = clickMap.get(id) || []
  const recent = times.filter(t => now - t < 1500)
  recent.push(now)
  clickMap.set(id, recent)
  if (recent.length >= 3) {
    queueEvent(id, 'rage_click')
    clickMap.set(id, [])
  }
}

const handleFocus = (e: FocusEvent) => {
  const el = e.target as HTMLInputElement
  if (!['INPUT', 'TEXTAREA'].includes(el.tagName)) return
  const id = getElementId(el)
  const onBlur = () => {
    if (!el.value) {
      queueEvent(id, 'input_abandon')
    }
    el.removeEventListener('blur', onBlur)
  }
  el.addEventListener('blur', onBlur)
}

const handleUnload = () => {
  if (eventQueue.length === 0) return
  navigator.sendBeacon
    ? navigator.sendBeacon('/behavior/batch', JSON.stringify({ events: eventQueue }))
    : flush()
}

export const startTracker = () => {
  document.addEventListener('click', handleClick)
  document.addEventListener('focusin', handleFocus)
  window.addEventListener('beforeunload', handleUnload)
}

export const stopTracker = () => {
  document.removeEventListener('click', handleClick)
  document.removeEventListener('focusin', handleFocus)
  window.removeEventListener('beforeunload', handleUnload)
  flush()
}
