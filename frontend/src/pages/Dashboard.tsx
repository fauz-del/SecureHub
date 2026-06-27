import { useEffect, useState } from 'react'
import { IconFile, IconChartBar, IconUsers, IconActivity } from '@tabler/icons-react'
import StatCard from '../components/StatCard'
import { getRecords, getStats } from '../api/records'
import { useAuth } from '../auth/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ total: 0, active: 0, leads: 0 })
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, recordsData] = await Promise.all([
          getStats(),
          getRecords(1, 5)
        ])
        setStats(statsData)
        setRecords(recordsData)
      } catch (err) {
        console.error('Failed to load dashboard data', err)
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

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-lg font-medium text-gray-900 dark:text-[#e8e6f8]">
          Dashboard
        </h1>
        <p className="text-sm text-gray-400 dark:text-[#555]">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total records"
          value={String(stats.total)}
          trend="All time"
          trendUp={true}
          icon={<IconFile size={16} />}
        />
        <StatCard
          label="Active deals"
          value={String(stats.active)}
          trend="Currently active"
          trendUp={true}
          icon={<IconChartBar size={16} />}
        />
        <StatCard
          label="Open leads"
          value={String(stats.leads)}
          trend="Awaiting conversion"
          trendUp={true}
          icon={<IconUsers size={16} />}
        />
        <StatCard
          label="Friction events"
          value="0"
          trend="No issues yet"
          trendUp={true}
          icon={<IconActivity size={16} />}
          valueColor="text-[#1D9E75]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-[#1c1c27] border border-gray-100 dark:border-[#2a2a38] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-[#2a2a38] flex justify-between items-center">
            <p className="text-sm font-medium text-gray-900 dark:text-[#e8e6f8]">Recent records</p>
            <span className="text-xs text-gray-400 dark:text-[#555]">Latest 5</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <td className="px-5 py-3 text-xs text-gray-400 dark:text-[#444] font-medium">Client</td>
                <td className="px-5 py-3 text-xs text-gray-400 dark:text-[#444] font-medium">Value</td>
                <td className="px-5 py-3 text-xs text-gray-400 dark:text-[#444] font-medium">Status</td>
              </tr>
            </thead>
            <tbody>
              {records.map((row, i) => (
                <tr key={i} className="border-t border-gray-50 dark:border-[#23232f]">
                  <td className="px-5 py-3 text-gray-700 dark:text-[#ccc]">{row.client_name}</td>
                  <td className="px-5 py-3 text-gray-400 dark:text-[#555]">${row.deal_value.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      row.status === 'Active' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                      row.status === 'Lead'   ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' :
                      'bg-gray-100 dark:bg-[#2a2a38] text-gray-500 dark:text-[#555]'
                    }`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white dark:bg-[#1c1c27] border border-gray-100 dark:border-[#2a2a38] rounded-xl p-5">
          <p className="text-sm font-medium text-gray-900 dark:text-[#e8e6f8] mb-4">
            {user?.role === 'admin' ? 'Friction report' : 'My summary'}
          </p>
          {user?.role === 'admin' ? (
            <div className="space-y-3">
              <div className="bg-red-50 dark:bg-red-900/15 rounded-lg p-3">
                <p className="text-xs text-red-400 mb-1">Rage clicks</p>
                <p className="text-2xl font-medium text-red-600 dark:text-red-400">0</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/15 rounded-lg p-3">
                <p className="text-xs text-amber-400 mb-1">Abandoned inputs</p>
                <p className="text-2xl font-medium text-amber-600 dark:text-amber-400">0</p>
              </div>
              <p className="text-xs text-gray-400 dark:text-[#555] text-center mt-2">
                Behavior tracking active
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/15 rounded-lg p-3">
                <p className="text-xs text-green-400 mb-1">My active deals</p>
                <p className="text-2xl font-medium text-green-600 dark:text-green-400">{stats.active}</p>
              </div>
              <div className="bg-[#EEEDFE] dark:bg-[#7F77DD]/15 rounded-lg p-3">
                <p className="text-xs text-[#534AB7] dark:text-[#AFA9EC] mb-1">My open leads</p>
                <p className="text-2xl font-medium text-[#534AB7] dark:text-[#AFA9EC]">{stats.leads}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}