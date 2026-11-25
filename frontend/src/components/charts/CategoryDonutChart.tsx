import React, { useState } from 'react'
import { Transaction, Category } from '../../types'
import { formatCurrency, getCategoryColor, getCategoryEmoji } from '../../utils/formatters'

interface CategoryDonutChartProps {
  transactions: Transaction[]
  onSelectCategory?: (category: Category | null) => void
  selectedCategory?: Category | null
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  transactions,
  onSelectCategory,
  selectedCategory,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  // Filter only expenses
  const expenses = transactions.filter(t => t.type === 'expense')
  const totalAmount = expenses.reduce((sum, t) => sum + t.amount, 0)

  // Aggregate by category
  const categoryMap: Record<string, number> = {}
  expenses.forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount
  })

  // Sort descending
  const sortedCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({
      category: category as Category,
      amount,
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
      color: getCategoryColor(category),
      emoji: getCategoryEmoji(category),
    }))

  const size = 240
  const center = size / 2
  const radius = 80
  const strokeWidth = 32

  // Generate SVG arcs using stroke-dasharray & stroke-dashoffset
  const circumference = 2 * Math.PI * radius
  let accumulatedPercent = 0

  const activeCategory = hoveredCategory || selectedCategory

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
      {/* SVG Donut Center */}
      <div className="relative w-[210px] h-[210px] flex items-center justify-center shrink-0">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full -rotate-90 transform"
        >
          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
          />

          {sortedCategories.map((item) => {
            const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference)
            accumulatedPercent += item.percentage

            const isHovered = hoveredCategory === item.category
            const isSelected = selectedCategory === item.category

            return (
              <circle
                key={item.category}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={item.color.hex}
                strokeWidth={isHovered || isSelected ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-200 cursor-pointer hover:opacity-90"
                onMouseEnter={() => setHoveredCategory(item.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(selectedCategory === item.category ? null : item.category)
                  }
                }}
              />
            )
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          {activeCategory ? (
            <>
              <span className="text-xl">
                {getCategoryEmoji(activeCategory)}
              </span>
              <span className="text-[11px] font-semibold text-slate-300 truncate max-w-[120px]">
                {activeCategory}
              </span>
              <span className="text-sm font-bold text-white">
                {formatCurrency(categoryMap[activeCategory] || 0)}
              </span>
              <span className="text-[10px] text-emerald-400">
                {totalAmount > 0 ? (((categoryMap[activeCategory] || 0) / totalAmount) * 100).toFixed(1) : 0}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                Total Spend
              </span>
              <span className="text-lg font-bold text-white">
                {formatCurrency(totalAmount)}
              </span>
              <span className="text-[10px] text-slate-400">
                {expenses.length} expenses
              </span>
            </>
          )}
        </div>
      </div>

      {/* Interactive Legend List */}
      <div className="flex-1 w-full space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {sortedCategories.map((item) => {
          const isSelected = selectedCategory === item.category
          return (
            <button
              key={item.category}
              onClick={() => {
                if (onSelectCategory) {
                  onSelectCategory(isSelected ? null : item.category)
                }
              }}
              onMouseEnter={() => setHoveredCategory(item.category)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`w-full flex items-center justify-between p-2 rounded-xl transition text-left text-xs ${
                isSelected 
                  ? 'bg-emerald-500/20 border border-emerald-500/40' 
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color.hex }}
                />
                <span className="text-slate-200 font-medium flex items-center gap-1.5">
                  <span>{item.emoji}</span>
                  {item.category}
                </span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-100 mr-2">
                  {formatCurrency(item.amount)}
                </span>
                <span className="text-[11px] text-slate-400">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
