import TransactionItem from './TransactionItem'

export default function TransactionList({ transactions, onDelete, onEdit }) {
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800">Recent Transactions</h2>
        {transactions.length > 0 && (
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
            {transactions.length}
          </span>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="5" width="20" height="14" rx="2" stroke="#9ca3af" strokeWidth="1.5"/>
              <path d="M2 10h20" stroke="#9ca3af" strokeWidth="1.5"/>
              <path d="M6 15h4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-gray-600 text-sm font-medium">No transactions yet</p>
          <p className="text-gray-400 text-xs mt-1 text-center">
            Add your first income or expense to get started
          </p>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-80 custom-scroll -mr-1 pr-1">
          {sorted.map((t, i) => (
            <TransactionItem
              key={t.id}
              transaction={t}
              onDelete={onDelete}
              onEdit={onEdit}
              isLast={i === sorted.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
