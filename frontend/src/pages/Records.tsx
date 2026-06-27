import { useState, useEffect } from 'react'
import { IconPlus, IconEdit, IconTrash, IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react'
import { getRecords, createRecord, updateRecord, deleteRecord } from '../api/records'

const statusStyle: Record<string, string> = {
  Active: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  Lead:   'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  Closed: 'bg-gray-100 dark:bg-[#2a2a38] text-gray-500 dark:text-[#555]',
}

const EMPTY_FORM = { client_name: '', deal_value: '', status: 'Lead' }

export default function Records() {
  const [records, setRecords] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = async (p = page) => {
    setLoading(true)
    try {
      const data = await getRecords(p, 10)
      setRecords(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [page])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEdit = (r: any) => {
    setEditing(r)
    setForm({ client_name: r.client_name, deal_value: String(r.deal_value), status: r.status })
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing) {
        await updateRecord(editing.id, { ...form, deal_value: Number(form.deal_value) })
      } else {
        await createRecord({ ...form, deal_value: Number(form.deal_value) })
      }
      setShowModal(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    await deleteRecord(id)
    setDeleteId(null)
    load()
  }

  return (
    <div className="p-6 space-y-4">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-medium text-gray-900 dark:text-[#e8e6f8]">Records</h1>
          <p className="text-sm text-gray-400 dark:text-[#555]">Manage your business records</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-[#534AB7] hover:bg-[#3C3489] text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <IconPlus size={15} />
          Add record
        </button>
      </div>

      <div className="bg-white dark:bg-[#1c1c27] border border-gray-100 dark:border-[#2a2a38] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#534AB7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
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
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 dark:text-[#444]">
                    {r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(r)} className="text-gray-300 dark:text-[#333] hover:text-[#534AB7] dark:hover:text-[#7F77DD] transition-colors">
                        <IconEdit size={15} />
                      </button>
                      <button onClick={() => setDeleteId(r.id)} className="text-gray-300 dark:text-[#333] hover:text-red-500 transition-colors">
                        <IconTrash size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="px-5 py-3 border-t border-gray-100 dark:border-[#2a2a38] flex justify-between items-center">
          <span className="text-xs text-gray-400 dark:text-[#444]">Page {page}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-100 dark:border-[#2a2a38] text-gray-400 hover:bg-gray-50 dark:hover:bg-[#23232f] transition-colors disabled:opacity-40"
            >
              <IconChevronLeft size={14} />
            </button>
            <span className="text-xs text-gray-400 px-2">{page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={records.length < 10}
              className="p-1.5 rounded-lg border border-gray-100 dark:border-[#2a2a38] text-gray-400 hover:bg-gray-50 dark:hover:bg-[#23232f] transition-colors disabled:opacity-40"
            >
              <IconChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1c1c27] border border-gray-100 dark:border-[#2a2a38] rounded-2xl w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm font-medium text-gray-900 dark:text-[#e8e6f8]">
                {editing ? 'Edit record' : 'Add record'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <IconX size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-[#555] block mb-1.5">Client name</label>
                <input
                  id="client-name"
                  value={form.client_name}
                  onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-[#13131a] border border-gray-200 dark:border-[#2a2a38] rounded-lg text-gray-900 dark:text-[#e8e6f8] focus:outline-none focus:border-[#534AB7]"
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-[#555] block mb-1.5">Deal value ($)</label>
                <input
                  id="deal-value"
                  type="number"
                  value={form.deal_value}
                  onChange={e => setForm(f => ({ ...f, deal_value: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-[#13131a] border border-gray-200 dark:border-[#2a2a38] rounded-lg text-gray-900 dark:text-[#e8e6f8] focus:outline-none focus:border-[#534AB7]"
                  placeholder="e.g. 5000"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-[#555] block mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-[#13131a] border border-gray-200 dark:border-[#2a2a38] rounded-lg text-gray-900 dark:text-[#e8e6f8] focus:outline-none focus:border-[#534AB7]"
                >
                  <option value="Lead">Lead</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <button
                id="save-record"
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[#534AB7] hover:bg-[#3C3489] text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : editing ? 'Save changes' : 'Add record'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1c1c27] border border-gray-100 dark:border-[#2a2a38] rounded-2xl w-full max-w-xs p-6 text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-[#e8e6f8] mb-2">Delete record?</p>
            <p className="text-xs text-gray-400 dark:text-[#555] mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 text-sm border border-gray-200 dark:border-[#2a2a38] rounded-lg text-gray-500 dark:text-[#555] hover:bg-gray-50 dark:hover:bg-[#23232f] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
