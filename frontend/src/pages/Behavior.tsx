import { useEffect, useState } from 'react'
import { IconActivity, IconHandStop, IconKeyboard, IconAlertTriangle } from '@tabler/icons-react'
import { getFrictionReport } from '../api/behavior'

export default function Behavior() {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getFrictionReport()
        setReport(data)
      } catch (err) {
        console.error('Failed to load behavior report', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-[#534AB7] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const rage = report?.rage_clicks || 0
  const abandoned = report?.abandoned_inputs || 0
  const total = rage + abandoned
  const flagged = report?.top_elements?.length || 0

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-lg font-medium text-gray-900 dark:text-[#e8e6f8]">Behavior tracker</h1>
        <p className="text-sm text-gray-400 dark:text-[#555]">Monitor user friction and interaction patterns</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total events',     value: total,     icon: <IconActivity size={16} />,      bg: 'bg-[#EEEDFE] dark:bg-[#7F77DD]/15', text: 'text-[#534AB7] dark:text-[#AFA9EC]' },
          { label: 'Rage clicks',      value: rage,      icon: <IconHandStop size={16} />,      bg: 'bg-red-50 dark:bg-red-900/15',       text: 'text-red-600 dark:text-red-400' },
          { label: 'Abandoned inputs', value: abandoned, icon: <IconKeyboard size={16} />,      bg: 'bg-amber-50 dark:bg-amber-900/15',   text: 'text-amber-600 dark:text-amber-400' },
          { label: 'Elements flagged', value: flagged,   icon: <IconAlertTriangle size={16} />, bg: 'bg-orange-50 dark:bg-orange-900/15', text: 'text-orange-600 dark:text-orange-400' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#1c1c27] border border-gray-100 dark:border-[#2a2a38] rounded-xl p-4">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs text-gray-400 dark:text-[#555]">{s.label}</p>
              <div className={`${s.bg} ${s.text} p-1.5 rounded-lg`}>{s.icon}</div>
            </div>
            <p className={`text-2xl font-medium ${s.text}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="bg-white dark:bg-[#1c1c27] border border-gray-100 dark:border-[#2a2a38] rounded-xl p-5">
          <p className="text-sm font-medium text-gray-900 dark:text-[#e8e6f8] mb-4">Top friction points</p>
          {report?.top_elements?.length > 0 ? (
            <div className="space-y-4">
              {report.top_elements.map((item: any, i: number) => {
                const max = report.top_elements[0].count
                const pct = Math.round((item.count / max) * 100)
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 dark:text-[#ccc] font-medium">{item.element_id}</span>
                        <span className="text-gray-400 dark:text-[#444] bg-gray-100 dark:bg-[#2a2a38] px-1.5 py-0.5 rounded">
                          {item.event_type}
                        </span>
                      </div>
                      <span className="text-gray-400 dark:text-[#444]">{item.count}x</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-[#2a2a38] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.event_type === 'rage_click' ? 'bg-[#D85A30]' : 'bg-amber-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/15 rounded-full flex items-center justify-center mb-3">
                <IconActivity size={18} className="text-green-500" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-[#555]">No friction detected</p>
              <p className="text-xs text-gray-400 dark:text-[#444] mt-1">Users are interacting smoothly</p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-[#1c1c27] border border-gray-100 dark:border-[#2a2a38] rounded-xl p-5">
          <p className="text-sm font-medium text-gray-900 dark:text-[#e8e6f8] mb-4">How tracking works</p>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-red-50 dark:bg-red-900/15 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconHandStop size={15} className="text-red-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 dark:text-[#ccc] mb-0.5">Rage click detection</p>
                <p className="text-xs text-gray-400 dark:text-[#555]">Fires when the same element is clicked 3 or more times within 1.5 seconds — signals a broken or unresponsive UI element.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-amber-50 dark:bg-amber-900/15 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconKeyboard size={15} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 dark:text-[#ccc] mb-0.5">Input abandonment</p>
                <p className="text-xs text-gray-400 dark:text-[#555]">Fires when a user clicks into a text field but leaves without typing — signals a confusing label or unexpected field.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#EEEDFE] dark:bg-[#7F77DD]/15 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconActivity size={15} className="text-[#534AB7] dark:text-[#AFA9EC]" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 dark:text-[#ccc] mb-0.5">Batched reporting</p>
                <p className="text-xs text-gray-400 dark:text-[#555]">Events are collected silently and sent in batches after 3 seconds of inactivity — no impact on app performance.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
