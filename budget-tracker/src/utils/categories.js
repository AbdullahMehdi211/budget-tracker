export const CATEGORIES = [
  { key: 'food',          label: 'Food & Groceries',  color: '#f97316', emoji: '🍔' },
  { key: 'rent',          label: 'Rent & Housing',    color: '#8b5cf6', emoji: '🏠' },
  { key: 'transport',     label: 'Transport',         color: '#3b82f6', emoji: '🚗' },
  { key: 'entertainment', label: 'Entertainment',     color: '#ec4899', emoji: '🎬' },
  { key: 'health',        label: 'Health',            color: '#10b981', emoji: '💊' },
  { key: 'utilities',     label: 'Utilities',         color: '#f59e0b', emoji: '💡' },
  { key: 'shopping',      label: 'Shopping',          color: '#6366f1', emoji: '🛍️' },
  { key: 'other',         label: 'Other',             color: '#6b7280', emoji: '📦' },
  { key: 'income',        label: 'Income',            color: '#22c55e', emoji: '💰' },
]

export const getCategoryByKey = (key) =>
  CATEGORIES.find(c => c.key === key) ?? CATEGORIES.find(c => c.key === 'other')

export const EXPENSE_CATEGORIES = CATEGORIES.filter(c => c.key !== 'income')
