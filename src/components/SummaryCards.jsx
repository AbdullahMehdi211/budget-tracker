import { formatCurrency } from '../utils/formatters'

function Card({ label, amount, colorClass, bgClass, borderClass, icon, sign }) {
  return (
    <div className={`rounded-xl border p-5 flex flex-col gap-3 shadow-sm transition-shadow hover:shadow-md ${bgClass} ${borderClass}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${bgClass === 'bg-white' ? 'bg-gray-50' : ''}`}>
          {icon}
        </span>
      </div>
      <div>
        <p className={`text-2xl font-bold tracking-tight ${colorClass}`}>
          {sign}{formatCurrency(amount)}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">All time total</p>
      </div>
    </div>
  )
}

export default function SummaryCards({ totalIncome, totalExpenses, balance }) {
  const balancePositive = balance >= 0
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card
        label="Total Income"
        amount={totalIncome}
        colorClass="text-emerald-700"
        bgClass="bg-white"
        borderClass="border-gray-200"
        icon="📈"
        sign=""
      />
      <Card
        label="Total Expenses"
        amount={totalExpenses}
        colorClass="text-red-600"
        bgClass="bg-white"
        borderClass="border-gray-200"
        icon="📉"
        sign=""
      />
      <Card
        label="Net Balance"
        amount={Math.abs(balance)}
        colorClass={balancePositive ? 'text-indigo-700' : 'text-red-600'}
        bgClass={balancePositive ? 'bg-indigo-50' : 'bg-red-50'}
        borderClass={balancePositive ? 'border-indigo-200' : 'border-red-200'}
        icon={balancePositive ? '✅' : '⚠️'}
        sign={balancePositive ? '+' : '-'}
      />
    </div>
  )
}
