import { useState } from 'react'
import { formatCurrency } from '../utils/formatters'

function currentMonthKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function currentMonthLabel() {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function getMonthExpenses(transactions) {
  const prefix = currentMonthKey()
  return transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(prefix))
    .reduce((s, t) => s + t.amount, 0)
}

export default function BudgetProgress({ transactions, getBudget, setBudget }) {
  const monthKey = currentMonthKey()
  const budget = getBudget(monthKey)
  const spent = getMonthExpenses(transactions)

  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
  const isOver = budget > 0 && spent > budget
  const isWarning = !isOver && pct >= 75

  const startEditing = () => {
    setInputValue(budget > 0 ? String(budget) : '')
    setEditing(true)
  }

  const commitEdit = () => {
    const amount = parseFloat(inputValue)
    if (!isNaN(amount) && amount > 0) setBudget(monthKey, amount)
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') setEditing(false)
  }

  const barColor = isOver
    ? 'bg-red-500'
    : isWarning
    ? 'bg-amber-400'
    : 'bg-indigo-500'

  const barTrack = isOver ? 'bg-red-100' : isWarning ? 'bg-amber-50' : 'bg-gray-100'

  const statusColor = isOver
    ? 'text-red-700'
    : isWarning
    ? 'text-amber-700'
    : 'text-indigo-700'

  const cardBorder = isOver
    ? 'border-red-300 bg-red-50'
    : isWarning
    ? 'border-amber-300 bg-amber-50'
    : 'border-gray-200 bg-white'

  return (
    <div className={`rounded-xl border shadow-sm p-5 transition-all duration-300 ${cardBorder}`}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className={`text-sm font-semibold ${isOver ? 'text-red-800' : isWarning ? 'text-amber-800' : 'text-gray-800'}`}>
            {currentMonthLabel()} Budget
          </h2>
          {isOver && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-500 text-white px-2 py-0.5 rounded-full">
              <span aria-hidden="true">!</span> Over budget
            </span>
          )}
          {isWarning && !isOver && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full">
              Approaching limit
            </span>
          )}
        </div>

        {editing ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Rs.</span>
            <input
              autoFocus
              type="number"
              min="1"
              step="1"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleKeyDown}
              className="focus-ring w-28 border border-indigo-400 rounded-lg px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              placeholder="e.g. 20000"
              aria-label="Monthly budget amount"
            />
            <button
              onClick={commitEdit}
              className="focus-ring text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors px-1 py-1"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={startEditing}
            className={`focus-ring flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors border ${
              isOver
                ? 'text-red-600 border-red-200 bg-red-100 hover:bg-red-200'
                : 'text-gray-500 border-gray-200 bg-gray-50 hover:bg-gray-100 hover:text-indigo-600'
            }`}
            aria-label={budget > 0 ? 'Edit monthly budget' : 'Set monthly budget'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {budget > 0 ? 'Edit budget' : 'Set budget'}
          </button>
        )}
      </div>

      {budget > 0 ? (
        <>
          {/* Progress bar */}
          <div className={`w-full rounded-full h-2.5 overflow-hidden mb-3 ${barTrack}`} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ease-out ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between text-xs">
            <span className={isOver ? 'text-red-600 font-medium' : 'text-gray-500'}>
              {formatCurrency(spent)} <span className="text-gray-400">spent</span>
            </span>
            <div className="flex items-center gap-1">
              <span className={`font-semibold ${statusColor}`}>
                {isOver
                  ? `${formatCurrency(spent - budget)} over`
                  : `${formatCurrency(budget - spent)} remaining`}
              </span>
              <span className="text-gray-400">/ {formatCurrency(budget)}</span>
              <span className="ml-1 text-gray-400 font-normal">
                ({Math.round(pct)}%)
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-1">
          <p className="text-sm text-gray-500">
            No monthly budget set. Set one to track how close you are to your limit.
          </p>
          <button
            onClick={startEditing}
            className="focus-ring flex-shrink-0 text-sm font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-3 py-1.5 rounded-lg transition-colors bg-indigo-50 hover:bg-indigo-100"
          >
            Set budget
          </button>
        </div>
      )}
    </div>
  )
}
