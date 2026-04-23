import { getCategoryByKey } from '../utils/categories'
import { formatCurrency, formatDate } from '../utils/formatters'

export default function TransactionItem({ transaction, onDelete, onEdit, isLast }) {
  const cat = getCategoryByKey(transaction.category)
  const isIncome = transaction.type === 'income'

  const handleDelete = () => {
    if (window.confirm(`Delete "${transaction.description}"?`)) {
      onDelete(transaction.id)
    }
  }

  return (
    <div className={`flex items-center gap-3 py-3 ${isLast ? '' : 'border-b border-gray-100'}`}>
      {/* Category icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
        style={{ backgroundColor: cat.color + '1a' }}
        aria-hidden="true"
      >
        {cat.emoji}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate leading-snug">
          {transaction.description}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span
            className="text-xs px-1.5 py-0.5 rounded-md font-medium"
            style={{ backgroundColor: cat.color + '18', color: cat.color }}
          >
            {cat.label}
          </span>
          <span className="text-xs text-gray-400">{formatDate(transaction.date)}</span>
        </div>
      </div>

      {/* Amount + Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <span className={`text-sm font-bold mr-1 tabular-nums ${isIncome ? 'text-emerald-700' : 'text-red-600'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </span>

        <button
          onClick={() => onEdit(transaction)}
          className="focus-ring p-1.5 rounded-lg text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
          aria-label={`Edit transaction: ${transaction.description}`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          onClick={handleDelete}
          className="focus-ring p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
          aria-label={`Delete transaction: ${transaction.description}`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
