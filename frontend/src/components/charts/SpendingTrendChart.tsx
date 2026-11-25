import React, { useState } from 'react'
import { Transaction } from '../../types'
import { formatCurrency } from '../../utils/formatters'

interface SpendingTrendChartProps {
  transactions: Transaction[]
  days?: number
}

export const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({ transactions, days = 14 }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; amount: number; x: number; y: number } | null>(null)

  // Aggregate daily expenses for the last N days
  const today = new Date()
  const dataPoints: { date: string; label: string; amount: number }[] = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayLabel = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

    const totalForDay = transactions
      .filter(t => t.type === 'expense' && t.date === dateStr)
      .reduce((sum, t) => sum + t.amount, 0)

    dataPoints.push({
      date: dateStr,
      label: dayLabel,
      amount: totalForDay,
    })
  }

  const maxAmount = Math.max(1000, ...dataPoints.map(p => p.amount))
  const width = 650
  const height = 220
  const paddingLeft = 45
  const paddingRight = 20
  const paddingTop = 25
  const paddingBottom = 35

  const chartW = width - paddingLeft - paddingRight
  const chartH = height - paddingTop - paddingBottom

  // Calculate points
  const points = dataPoints.map((pt, idx) => {
    const x = paddingLeft + (idx / Math.max(1, dataPoints.length - 1)) * chartW
    const y = paddingTop + chartH - (pt.amount / maxAmount) * chartH
    return { ...pt, x, y }
  })

  // Generate smooth SVG path
  let pathD = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const cx = (p0.x + p1.x) / 2
    pathD += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`
  }

  // Area under line
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartH} L ${points[0].x} ${paddingTop + chartH} Z`

  return (
    <div className="w-full relative overflow-hidden select-none">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            Last {days} Days Activity
          </span>
        </div>
        <div className="text-xs text-slate-400">
          Max: <span className="font-semibold text-slate-200">{formatCurrency(maxAmount)}</span>
        </div>
      </div>

      <div className="relative w-full aspect-[650/220]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = paddingTop + chartH * (1 - ratio)
            const val = Math.round(maxAmount * ratio)
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="4 4"
                  strokeOpacity={0.4}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  fontSize="9"
                  fill="#64748b"
                  textAnchor="end"
                >
                  ₹{val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                </text>
              </g>
            )
          })}

          {/* Area fill */}
          <path d={areaD} fill="url(#spendGrad)" />

          {/* Smooth trend curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => (
            <g key={idx}>
              {/* Invisible larger hover target */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="10"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint({ date: pt.label, amount: pt.amount, x: pt.x, y: pt.y })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint?.date === pt.label ? '5' : '3.5'}
                fill="#022c22"
                stroke="#10b981"
                strokeWidth="2.5"
                className="transition-all duration-150 pointer-events-none"
              />
              {/* X Axis Labels on alternating points */}
              {idx % 2 === 0 && (
                <text
                  x={pt.x}
                  y={paddingTop + chartH + 18}
                  fontSize="9.5"
                  fill="#94a3b8"
                  textAnchor="middle"
                >
                  {pt.label}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Floating tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900 border border-slate-700 text-white px-2.5 py-1.5 rounded-lg shadow-xl text-xs space-y-0.5"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100 - 8}%`,
            }}
          >
            <div className="text-[10px] text-slate-400 font-medium">{hoveredPoint.date}</div>
            <div className="font-bold text-emerald-400">{formatCurrency(hoveredPoint.amount)}</div>
          </div>
        )}
      </div>
    </div>
  )
}
