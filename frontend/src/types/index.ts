export interface User {
  id: number
  email: string
  role: 'admin' | 'standard'
}

export interface AuthToken {
  access_token: string
  token_type: string
}

export interface Record {
  id: number
  client_name: string
  deal_value: number
  status: 'Lead' | 'Active' | 'Closed'
  updated_by: number
  updated_at: string
}

export interface BehaviorEvent {
  session_id: string
  element_id: string
  event_type: 'rage_click' | 'input_abandon'
  timestamp: string
}

export interface FrictionSummary {
  rage_clicks: number
  abandoned_inputs: number
  top_elements: {
    element_id: string
    event_type: string
    count: number
  }[]
}