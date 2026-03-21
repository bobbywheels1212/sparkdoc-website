import { useState } from 'react'
import { customers } from '../data/mockData'
import { Search, Plus, ChevronUp, ChevronDown, Phone, Mail, Star } from 'lucide-react'

const statusBadge = {
  active: 'bg-green-50 text-green-700',
  lead: 'bg-blue-50 text-blue-700',
  vip: 'bg-purple-50 text-purple-700',
}

const avatarColors = [
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-green-400 to-green-600',
  'from-amber-400 to-amber-600',
  'from-red-400 to-red-600',
  'from-cyan-400 to-cyan-600',
  'from-pink-400 to-pink-600',
]

export default function Customers() {
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = customers
    .filter(c => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.address.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      let va = a[sortField] ?? ''
      let vb = b[sortField] ?? ''
      if (typeof va === 'string') va = va.toLowerCase()
      if (typeof vb === 'string') vb = vb.toLowerCase()
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const toggleSort = field => {
    if (sortField === field) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={11} className="text-gray-300" />
    return sortDir === 'asc' ? (
      <ChevronUp size={11} className="text-gray-500" />
    ) : (
      <ChevronDown size={11} className="text-gray-500" />
    )
  }

  const cols = [
    { label: 'Name', field: 'name' },
    { label: 'Location', field: 'address' },
    { label: 'Contact', field: null },
    { label: 'Jobs', field: 'totalJobs' },
    { label: 'Lifetime Value', field: 'lifetimeValue' },
    { label: 'Status', field: 'status' },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-400">
            {customers.length} total · {customers.filter(c => c.status === 'lead').length} leads ·{' '}
            {customers.filter(c => c.status === 'vip').length} VIP
          </p>
        </div>
        <button className="flex items-center gap-1.5 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors">
          <Plus size={14} />
          Add Customer
        </button>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-md px-3 py-1.5 w-64">
          <Search size={13} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>
        <div className="flex items-center gap-1">
          {['all', 'active', 'lead', 'vip'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-2.5 py-1 rounded-md capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {cols.map(col => (
                <th
                  key={col.label}
                  onClick={() => col.field && toggleSort(col.field)}
                  className={`text-left px-4 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide ${
                    col.field ? 'cursor-pointer hover:text-gray-600 select-none' : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.field && <SortIcon field={col.field} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((customer, idx) => (
              <tr
                key={customer.id}
                className="hover:bg-gray-50/60 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${
                        avatarColors[idx % avatarColors.length]
                      } flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}
                    >
                      {customer.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 leading-tight">{customer.name}</p>
                      <p className="text-xs text-gray-400">{customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 text-sm">{customer.address}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <a
                      href={`tel:${customer.phone}`}
                      onClick={e => e.stopPropagation()}
                      className="p-1 text-gray-300 hover:text-blue-500 transition-colors rounded"
                    >
                      <Phone size={13} />
                    </a>
                    <a
                      href={`mailto:${customer.email}`}
                      onClick={e => e.stopPropagation()}
                      className="p-1 text-gray-300 hover:text-blue-500 transition-colors rounded"
                    >
                      <Mail size={13} />
                    </a>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 text-sm">{customer.totalJobs}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={customer.lifetimeValue > 0 ? 'font-medium text-gray-800' : 'text-gray-300'}>
                    {customer.lifetimeValue > 0
                      ? `$${customer.lifetimeValue.toLocaleString()}`
                      : '—'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge[customer.status]}`}
                    >
                      {customer.status}
                    </span>
                    {customer.status === 'vip' && (
                      <Star size={11} className="text-purple-400 fill-purple-400" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400">No customers match your search.</div>
        )}
      </div>
    </div>
  )
}
