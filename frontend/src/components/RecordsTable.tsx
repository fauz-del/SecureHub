import { IconEdit, IconTrash, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import Badge from './Badge'
import { Record } from '../types'

interface RecordsTableProps {
  records: Record[]
  page: number
  total: number
  onPrev: () => void
  onNext: () => void
  onEdit: (record: Record) => void
  onDelete: (id: number) => void
}

export default function RecordsTable({
  records, page, total, onPrev, onNext, onEdit, onDelete
}: RecordsTableProps) {
  return (
    <div className="bg-white dark:bg-[#1c1c27] border border-gray-100 dark:border-[#2a2a38] rounded-xl overflow-hidden">
      <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr className="border-b border-gray-100 dark:border-[#2a2a38]">
            <td className="px-5 py-3 text-xs text-gray-400 dark:text-[#444] font-medium w-[30%]">Client</td>
            <td className="px-5 py-3 text-xs text-gray-400 dark:text-[#444] font-medium w-[20%]">Value</td>
            <td className="px-5 py-3 text-xs text-gray-400 dark:text-[#444] font-medium w-[20%]">Status</td>
            <td className="px-5 py-3 text-xs text-gray-400 dark:text-[#444] font-medium w-[18%]">Updated</td>
            <td className="px-5 py-3 text-xs text-gray-400 dark:text-[#444] font-medium w-[12%]">Actions</td>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-t border-gray-50 dark:border-[#23232f] hover:bg-gray-50 dark:hover:bg-[#23232f] transition-colors">
              <td className="px-5 py-3.5 text-gray-700 dark:text-[#ccc] font-medium">{r.client_name}</td>
              <td className="px-5 py-3.5 text-gray-500 dark:text-[#555]">${r.deal_value.toLocaleString()}</td>
              <td className="px-5 py-3.5"><Badge status={r.status} /></td>
              <td className="px-5 py-3.5 text-gray-400 dark:text-[#444]">{r.updated_at}</td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(r)}
                    className="text-gray-300 dark:text-[#333] hover:text-[#534AB7] dark:hover:text-[#7F77DD] transition-colors"
                  >
                    <IconEdit size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="text-gray-300 dark:text-[#333] hover:text-red-500 transition-colors"
                  >
                    <IconTrash size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-5 py-3 border-t border-gray-100 dark:border-[#2a2a38] flex justify-between items-center">
        <span className="text-xs text-gray-400 dark:text-[#444]">
          Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-gray-100 dark:border-[#2a2a38] text-gray-400 hover:bg-gray-50 dark:hover:bg-[#23232f] transition-colors disabled:opacity-40"
          >
            <IconChevronLeft size={14} />
          </button>
          <span className="text-xs text-gray-400 dark:text-[#444] px-2">{page}</span>
          <button
            onClick={onNext}
            disabled={page * 20 >= total}
            className="p-1.5 rounded-lg border border-gray-100 dark:border-[#2a2a38] text-gray-400 hover:bg-gray-50 dark:hover:bg-[#23232f] transition-colors disabled:opacity-40"
          >
            <IconChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
