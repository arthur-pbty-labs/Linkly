"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor: string | string[]
    borderWidth?: number
  }[]
}

interface AnalyticsChartProps {
  data: ChartData
  type: 'line' | 'bar' | 'doughnut'
  title: string
  height?: number
}

export function AnalyticsChart({ data, type, title, height = 300 }: AnalyticsChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: type !== 'doughnut' ? {
      x: {
        display: true,
        title: {
          display: true,
          text: type === 'line' ? 'Date' : 'Catégorie'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Nombre de clics'
        },
        beginAtZero: true,
      },
    } : undefined,
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  }

  const chartStyle = { height: `${height}px` }

  switch (type) {
    case 'line':
      return (
        <div style={chartStyle}>
          <Line data={data} options={options} />
        </div>
      )
    case 'bar':
      return (
        <div style={chartStyle}>
          <Bar data={data} options={options} />
        </div>
      )
    case 'doughnut':
      return (
        <div style={chartStyle}>
          <Doughnut data={data} options={options} />
        </div>
      )
    default:
      return null
  }
}