import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getCategoryByKey } from '../utils/categories'
import { formatCurrency } from '../utils/formatters'

function buildChartData(transactions) {
  const totals = {}
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => { totals[t.category] = (totals[t.category] ?? 0) + t.amount })

  return Object.entries(totals).map(([key, value]) => {
    const cat = getCategoryByKey(key)
    return { name: cat.label, value, color: cat.color }
  })
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 shadow-lg text-sm">
      <p className="font-semibold text-gray-800 mb-0.5">{payload[0].name}</p>
      <p className="text-gray-600 font-medium">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function CategoryChart({ transactions }) {
  const data = buildChartData(transactions)

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col items-center justify-center min-h-72">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-gray-600 text-sm font-medium">No expense data yet</p>
        <p className="text-gray-400 text-xs mt-1 text-center">Add some expenses to see your spending breakdown</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800">Spending by Category</h2>
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
          {data.length} {data.length === 1 ? 'category' : 'categories'}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={270}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={95}
            innerRadius={55}
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', color: '#6b7280', paddingTop: '8px' }}
            formatter={(value) => <span style={{ color: '#374151', fontWeight: '500' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
