import { ReactNode } from 'react'
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'

interface StatCardProps {
  label: string
  value: string
  trend: string
  trendUp: boolean
  icon: ReactNode
  valueColor?: string
}

export default function StatCard({ label, value, trend, trendUp, icon, valueColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1c1c27] border border-gray-100 dark:border-[#2a2a38] rounded-xl p-4">
      <div className="flex justify-between items-start mb-3">
        <p className="text-xs text-gray-400 dark:text-[#555]">{label}</p>
        <div className="text-gray-300 dark:text-[#333]">{icon}</div>
      </div>
      <p className={`text-2xl font-medium mb-2 ${valueColor || 'text-gray-900 dark:text-[#e8e6f8]'}`}>
        {value}
      </p>
      <div className="flex items-center gap-1">
        {trendUp
          ? <IconTrendingUp size={12} className="text-green-500" />
          : <IconTrendingDown size={12} className="text-red-400" />
        }
        <p className={`text-xs ${trendUp ? 'text-green-500' : 'text-red-400'}`}>
          {trend}
        </p>
      </div>
    </div>
  )
}
