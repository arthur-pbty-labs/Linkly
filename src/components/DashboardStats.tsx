import { LinkWithClicks } from '@/types'
import { BarChart3, Eye, Calendar, MousePointer } from 'lucide-react'

interface DashboardStatsProps {
  links: LinkWithClicks[]
}

export function DashboardStats({ links }: DashboardStatsProps) {
  const totalLinks = links.length
  const totalClicks = links.reduce((sum, link) => sum + (link._count?.clicks || 0), 0)
  const activeLinks = links.filter(link => link.isActive).length
  const recentLinks = links.filter(link => {
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    return new Date(link.createdAt) > threeDaysAgo
  }).length

  const stats = [
    {
      title: 'Total des liens',
      value: totalLinks,
      icon: BarChart3,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Total des clics',
      value: totalClicks,
      icon: MousePointer,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Liens actifs',
      value: activeLinks,
      icon: Eye,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Créés récemment',
      value: recentLinks,
      icon: Calendar,
      color: 'bg-orange-100 text-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}