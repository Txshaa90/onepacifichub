import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, Search } from 'lucide-react'
import { OPERATORS } from '../lib/filtering'

// Minimal, template-agnostic filtering + search bar
// Props:
// - fieldOptions: Array<{ value: string, label: string, type?: 'text'|'date'|'number'|'select' }>
// - filters: Array<{ id: string, field: string, operator: string, value: any }>
// - onFiltersChange: (filters) => void
// - searchQuery: string
// - onSearchChange: (q) => void
export default function SharedViewBar({ fieldOptions = [], filters = [], onFiltersChange, searchQuery = '', onSearchChange }) {
  const [draft, setDraft] = useState(() => ({
    field: fieldOptions?.[0]?.value || '',
    operator: 'contains',
    value: ''
  }))

  useEffect(() => {
    if (fieldOptions && fieldOptions.length) {
      setDraft(prev => ({ ...prev, field: fieldOptions[0].value }))
    }
  }, [fieldOptions])

  const selectedField = useMemo(() => fieldOptions.find(f => f.value === draft.field), [fieldOptions, draft.field])
  const operatorList = useMemo(() => {
    const t = selectedField?.type || 'text'
    return OPERATORS[t] || OPERATORS.text
  }, [selectedField])

  const addCondition = () => {
    if (!draft.field || !draft.operator) return
    if (draft.operator !== 'empty' && draft.operator !== 'not_empty' && (draft.value === '' || draft.value == null)) return
    const cond = {
      id: `f-${Date.now()}`,
      field: draft.field,
      operator: draft.operator,
      value: draft.value
    }
    onFiltersChange?.([...(filters || []), cond])
    setDraft({ field: fieldOptions?.[0]?.value || '', operator: 'contains', value: '' })
  }

  const removeCondition = (id) => {
    onFiltersChange?.((filters || []).filter(f => f.id !== id))
  }

  const clearAll = () => onFiltersChange?.([])

  return (
    <div className="w-full bg-white border border-neutral-200 rounded-xl p-3">
      {/* Top: Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search records..."
            title="Search"
            className="w-full pl-9 pr-3 py-2 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Existing filters */}
      {filters?.length > 0 && (
        <div className="mt-3 flex items-center flex-wrap gap-2">
          {filters.map((f) => (
            <div key={f.id} className="flex items-center gap-2 bg-neutral-100 border border-neutral-200 rounded-full px-3 py-1 text-sm">
              <span className="font-medium">{fieldOptions.find(o => o.value === f.field)?.label || f.field}</span>
              <span className="text-neutral-500">{f.operator}</span>
              {f.operator !== 'empty' && f.operator !== 'not_empty' && (
                <span className="font-medium">{String(f.value)}</span>
              )}
              <button type="button" onClick={() => removeCondition(f.id)} className="p-1 hover:bg-neutral-200 rounded-full" title="Remove this filter" aria-label="Remove filter">
                <Trash2 size={14} className="text-neutral-500" aria-hidden />
              </button>
            </div>
          ))}
          <button type="button" onClick={clearAll} title="Clear all filters" className="text-xs text-neutral-600 hover:text-neutral-800 underline">Clear all</button>
        </div>
      )}

      {/* Add new condition */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <select
          value={draft.field}
          onChange={(e) => setDraft(prev => ({ ...prev, field: e.target.value, operator: 'contains', value: '' }))}
          className="px-2 py-2 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Field"
        >
          {fieldOptions.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <select
          value={draft.operator}
          onChange={(e) => setDraft(prev => ({ ...prev, operator: e.target.value }))}
          className="px-2 py-2 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Operator"
        >
          {operatorList.map(op => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>

        {draft.operator === 'empty' || draft.operator === 'not_empty' ? (
          <button type="button" onClick={addCondition} title="Add filter condition" className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2">
            <Plus size={16} aria-hidden /> Add
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              value={draft.value}
              onChange={(e) => setDraft(prev => ({ ...prev, value: e.target.value }))}
              placeholder="Value..."
              title="Value"
              className="flex-1 px-2 py-2 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="button" onClick={addCondition} title="Add filter condition" className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2">
              <Plus size={16} aria-hidden /> Add
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
