import { useState, useEffect, useRef } from 'react'
import { EXPENSE_CATEGORIES } from '../utils/categories'

const today = () => new Date().toISOString().split('T')[0]

const initialForm = {
  type: 'expense',
  amount: '',
  description: '',
  category: 'food',
  date: today(),
}

export default function TransactionModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const firstFieldRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    setForm(
      initialData
        ? {
            type: initialData.type,
            amount: String(initialData.amount),
            description: initialData.description,
            category: initialData.category,
            date: initialData.date,
          }
        : { ...initialForm, date: today() }
    )
    setError('')

    // Trap focus briefly to first field when modal opens
    const timer = setTimeout(() => firstFieldRef.current?.focus(), 50)

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(timer)
    }
  }, [isOpen, onClose, initialData])

  if (!isOpen) return null

  const set = (field) => (e) => {
    setForm(prev => {
      const next = { ...prev, [field]: e.target.value }
      if (field === 'type') next.category = e.target.value === 'income' ? 'income' : 'food'
      return next
    })
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (!form.description.trim()) {
      setError('Please enter a description.')
      return
    }
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount greater than zero.')
      return
    }
    onSubmit({
      type: form.type,
      amount,
      description: form.description.trim(),
      category: form.category,
      date: form.date,
    })
    onClose()
  }

  const isIncome = form.type === 'income'

  const inputCls =
    'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow placeholder-gray-400'

  const submitColor = isIncome
    ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
    : 'bg-red-500 hover:bg-red-600 active:bg-red-700'

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={initialData ? 'Edit transaction' : 'Add transaction'}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[95dvh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl sm:rounded-t-2xl z-10">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {initialData ? 'Edit Transaction' : 'New Transaction'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {initialData ? 'Update the details below' : 'Fill in the details to add a record'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="focus-ring w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close dialog"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4" noValidate>
          {/* Type toggle */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Type
            </label>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden p-1 bg-gray-50 gap-1">
              {['expense', 'income'].map(type => {
                const active = form.type === type
                const activeStyle = type === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-red-500 text-white shadow-sm'
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setForm(prev => ({
                        ...prev,
                        type,
                        category: type === 'income' ? 'income' : 'food',
                      }))
                    }
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-semibold rounded-lg transition-all capitalize focus-ring ${
                      active ? activeStyle : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span aria-hidden="true">{type === 'income' ? '📈' : '📉'}</span>
                    {type === 'income' ? 'Income' : 'Expense'}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="modal-amount" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Amount <span className="text-red-400" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
                Rs.
              </span>
              <input
                id="modal-amount"
                ref={firstFieldRef}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={set('amount')}
                className={`${inputCls} pl-9`}
                required
                aria-required="true"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="modal-description" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Description <span className="text-red-400" aria-hidden="true">*</span>
            </label>
            <input
              id="modal-description"
              type="text"
              placeholder="e.g. Monthly rent, Grocery run..."
              value={form.description}
              onChange={set('description')}
              className={inputCls}
              maxLength={80}
              required
              aria-required="true"
            />
          </div>

          {/* Category (expenses only) */}
          {form.type === 'expense' && (
            <div>
              <label htmlFor="modal-category" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Category
              </label>
              <select
                id="modal-category"
                value={form.category}
                onChange={set('category')}
                className={inputCls}
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat.key} value={cat.key}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date */}
          <div>
            <label htmlFor="modal-date" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Date
            </label>
            <input
              id="modal-date"
              type="date"
              value={form.date}
              onChange={set('date')}
              className={inputCls}
              max={today()}
            />
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
                <path d="M12 8v4m0 4h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p className="text-red-700 text-xs font-medium">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className={`focus-ring w-full py-2.5 rounded-xl text-sm font-bold text-white transition-colors mt-1 shadow-sm ${submitColor}`}
          >
            {initialData
              ? 'Save Changes'
              : isIncome
              ? 'Add Income'
              : 'Add Expense'}
          </button>
        </form>
      </div>
    </div>
  )
}
