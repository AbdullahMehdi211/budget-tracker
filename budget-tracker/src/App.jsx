import { useState, useCallback } from 'react'
import { useTransactions } from './hooks/useTransactions'
import { useBudget } from './hooks/useBudget'
import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import BudgetProgress from './components/BudgetProgress'
import CategoryChart from './components/CategoryChart'
import TransactionList from './components/TransactionList'
import TransactionModal from './components/TransactionModal'

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const {
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    balance,
  } = useTransactions()
  const { getBudget, setBudget } = useBudget()

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setEditingTransaction(null)
  }, [])

  const handleEdit = useCallback((t) => {
    setEditingTransaction(t)
    setIsModalOpen(true)
  }, [])

  const handleSubmit = editingTransaction
    ? (data) => editTransaction(editingTransaction.id, data)
    : addTransaction

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onAddClick={() => setIsModalOpen(true)} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
        <SummaryCards
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
        />

        <BudgetProgress
          transactions={transactions}
          getBudget={getBudget}
          setBudget={setBudget}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <CategoryChart transactions={transactions} />
          <TransactionList
            transactions={transactions}
            onDelete={deleteTransaction}
            onEdit={handleEdit}
          />
        </div>
      </main>

      <footer className="text-center py-5 text-xs text-gray-400 border-t border-gray-200 bg-white mt-auto">
        Budget Tracker &mdash; all data stored locally in your browser
      </footer>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialData={editingTransaction}
      />
    </div>
  )
}
