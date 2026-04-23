import { useState, useEffect } from 'react'

const STORAGE_KEY = 'budget-tracker-budgets'

function loadBudgets() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

export function useBudget() {
  const [budgets, setBudgetsState] = useState(loadBudgets)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets))
  }, [budgets])

  const setBudget = (monthKey, amount) =>
    setBudgetsState(prev => ({ ...prev, [monthKey]: amount }))

  const getBudget = (monthKey) => budgets[monthKey] ?? 0

  return { getBudget, setBudget }
}
