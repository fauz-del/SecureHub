interface BadgeProps {
  status: 'Active' | 'Lead' | 'Closed'
}

const styles: Record<string, string> = {
  Active: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  Lead:   'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  Closed: 'bg-gray-100 dark:bg-[#2a2a38] text-gray-500 dark:text-[#555]',
}

export default function Badge({ status }: BadgeProps) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}
