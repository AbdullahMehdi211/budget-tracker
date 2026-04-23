import { useState, useEffect } from 'react'

const STORAGE_KEY = 'budget-tracker-transactions'

export function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (data) =>
    setTransactions(prev => [{ ...data, id: crypto.randomUUID() }, ...prev])

  const editTransaction = (id, data) =>
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))

  const deleteTransaction = (id) =>
    setTransactions(prev => prev.filter(t => t.id !== id))

  const totalIncome   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance       = totalIncome - totalExpenses

  return { transactions, addTransaction, editTransaction, deleteTransaction, totalIncome, totalExpenses, balance }
}
