import { useState } from 'react'
import { docs } from '../data/mockData'
import { Plus, Clock, Search } from 'lucide-react'

export default function Docs() {
  const [selectedDoc, setSelectedDoc] = useState(docs[0])
  const [search, setSearch] = useState('')

  const filteredDocs = docs.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  )

  const byCategory = filteredDocs.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = []
    acc[doc.category].push(doc)
    return acc
  }, {})

  return (
    <div className="flex h-full -m-6">
      {/* Doc sidebar / page tree */}
      <aside className="w-52 flex-shrink-0 border-r border-gray-100 bg-gray-50/60 flex flex-col">
        {/* Search */}
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-md px-2 py-1.5">
            <Search size={12} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search pages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-xs outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Page tree */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {Object.entries(byCategory).map(([category, categoryDocs]) => (
            <div key={category} className="mb-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-2 mb-1">
                {category}
              </p>
              {categoryDocs.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-sm transition-colors ${
                    selectedDoc?.id === doc.id
                      ? 'bg-white shadow-sm text-gray-800 border border-gray-100'
                      : 'text-gray-600 hover:bg-white hover:text-gray-800'
                  }`}
                >
                  <span className="text-sm flex-shrink-0">{doc.emoji}</span>
                  <span className="truncate text-xs">{doc.title}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* New page button */}
        <div className="p-2 border-t border-gray-100">
          <button className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-colors">
            <Plus size={12} />
            New page
          </button>
        </div>
      </aside>

      {/* Document content */}
      <main className="flex-1 overflow-auto bg-white">
        {selectedDoc ? (
          <DocView doc={selectedDoc} />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            Select a page to view
          </div>
        )}
      </main>
    </div>
  )
}

function DocView({ doc }) {
  return (
    <div className="max-w-2xl mx-auto px-14 py-10">
      {/* Emoji + title */}
      <div className="mb-8">
        <div className="text-5xl mb-4 select-none">{doc.emoji}</div>
        <h1 className="text-[2rem] font-bold text-gray-900 leading-tight mb-3">{doc.title}</h1>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            Last edited{' '}
            {new Date(doc.lastEdited + 'T12:00:00').toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{doc.category}</span>
        </div>
      </div>

      {/* Block content */}
      <div className="space-y-2">
        {doc.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </div>
  )
}

function Block({ block }) {
  switch (block.type) {
    case 'heading1':
      return (
        <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-1 first:mt-0">
          {block.content}
        </h1>
      )

    case 'heading2':
      return (
        <h2 className="text-base font-semibold text-gray-800 mt-6 mb-1">
          {block.content}
        </h2>
      )

    case 'paragraph':
      return (
        <p className="text-[15px] text-gray-600 leading-relaxed">{block.content}</p>
      )

    case 'checklist':
      return (
        <ul className="space-y-2 pl-0.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[15px] text-gray-600">
              <div className="w-4 h-4 border border-gray-300 rounded mt-0.5 flex-shrink-0 hover:border-blue-400 cursor-pointer transition-colors" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )

    case 'numbered':
      return (
        <ol className="space-y-2 pl-0.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[15px] text-gray-600">
              <span className="text-gray-400 text-sm font-mono w-4 text-right flex-shrink-0 mt-0.5">
                {i + 1}.
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )

    case 'quote':
      return (
        <blockquote className="border-l-2 border-gray-300 pl-4 py-0.5 my-1">
          <p className="text-[15px] text-gray-600 italic">{block.content}</p>
        </blockquote>
      )

    case 'callout':
      return (
        <div className="bg-amber-50 border border-amber-100 rounded-md px-4 py-3 text-sm text-amber-800 my-2">
          {block.content}
        </div>
      )

    case 'table':
      return (
        <div className="overflow-x-auto my-3">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {block.headers.map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {block.rows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2.5 text-gray-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    default:
      return null
  }
}
